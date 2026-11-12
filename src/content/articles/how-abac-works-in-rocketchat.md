---
idx: 29
title: "How ABAC works in Rocket.Chat"
date: 2026-11-11
slug: "how-abac-works-in-rocketchat"
tags: ["rocketchat", "security", "authorization", "architecture"]
excerpt: "How does attribute-based access control work in Rocket.Chat?"
draft: false
unlisted: true
featured: false
---

While working on attribute-based access control (ABAC) for Rocket.Chat, I had to deal with a question that sounds pretty simple: does this user have the attributes this room requires? That's the basis of ABAC: who can access the data, but letting the data itself being the judge.

Instead of traditional RBAC (Role based access control) where the user is granted access based on privileges, ABAC transfers that control to the data itself. Data then registers the *attributes* that allows someone to access. So, in our case, the *data* was the rooms. So the basis of ABAC in Rocket.Chat are:

- Rooms have attributes. The attributes define which users can access them.

The [9.0 release](https://github.com/RocketChat/Rocket.Chat/releases/tag/9.0.0) adds more ways to manage room attributes, including a preview of who would keep or lose access before you save a change. That was pretty much a performance nightmare, but we'll talk more about it later.

> ABAC was introduced for private channels and teams in [Rocket.Chat 8.0](https://github.com/RocketChat/Rocket.Chat/releases/tag/8.0.0), released in January 2026.

## Ok, what are we checking?

Imagine we have a private room for security work. Everyone in it needs to belong to the security department and have restricted clearance. As you see, the room publishes *who* can access implicitly, any user who happens to possess these attributes is then able to access the room.

For this example, the user's department and clearance come from LDAP. The default settings of Rocket.Chat reads attributes from this store and adds them to the users via an admin defined mapping, [`addSubjectAttributes`](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/index.ts#L347-L393) reads those mappings and saves the values in the Rocket.Chat user. Once we have both, the room attributes and the user attributes, we can make a decision.

With the local setup, those attributes end up in MongoDB. The code that decides whether they match is called the **policy decision point**, or PDP. That's the name you'll see very often when dealing with ABAC. A PDP is, how is name implies, the service where the 'magic' happens. It reads both attributes, validates them and then does the comparison to decide if the user can access the room.

That's a very simplified way to explain, but remember: each PDP could have their own way of evaluating attributes. Hierarchy relations, environment, timing, etc. In the case for Rocket.Chat's default, we used this simplified mechanism as it was faster for a first implementation.

## How's the access check performed?

Continuing our example, here we have both definitions, the user and the room one. I've simplified the data to show just the attributes that matter for the example:

```json
{
  "user": [
    { "key": "department", "values": ["engineering", "security"] },
    { "key": "clearance", "values": ["internal", "restricted"] }
  ],
  "room": [
    { "key": "department", "values": ["security"] },
    { "key": "clearance", "values": ["restricted"] }
  ]
}
```

At first glance, the user qualifies. The user has the attributes the room requires. A user can have *more* attributes than what the room expects, but it can never hold *less* than that.

That's the ABAC rule we use for the Rocket.Chat's own PDP: A user must contain *all* the attributes the room expects. So, lets see this other user:

```json
{
  "user": [
    { "key": "section", "values": ["engineering", "hightrust"] },
    { "key": "clearance", "values": ["internal", "restricted"] }
  ],
  "room": [
    { "key": "department", "values": ["security"] },
    { "key": "clearance", "values": ["restricted"] }
  ]
}
```

Now, the user doesn't have all the attributes, which means the PDP *must* decide the user is *non compliant* and deny access. And, that's ABAC!

![Two people approach doors requiring a circle and diamond. The person carrying both qualifies; the person carrying a circle and square does not.](/images/abac-attribute-matching.webp)

Now, let's do a deep dive into how it works in Rocket.Chat, technically speaking.

## Adding someone to a room

Let's continue with our security room. Someone tries to add a user, and Rocket.Chat runs the [`beforeAddUserToRoom` hook](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/apps/meteor/ee/server/hooks/abac/beforeAddUserToRoom.ts). The purpose of the hook is to check before adding the user if the attributes are compliant. This doesn't replace the existing permission checks, for example, a user adding another to a room still has to possess the traditional permission to add users, or be a room owner.

ABAC in Rocket.Chat works as a 2nd security layer.

For the local PDP, we can check several usernames in one database query. [`checkUsernamesMatchAttributes`](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/pdp/LocalPDP.ts) restricts the query with `username: { $in: usernames }` and searches for users who fail at least one requirement. If one is returned, then that user is deemed *non compliant* and as such, cannot access the room.

Why search for the ones who *don't* qualify? Because one missing requirement is enough to fail. We don't need to load every full user document into Node, loop through their attributes and build the same answer ourselves. We rely on MongoDB for doing these matches because of the way we structured the attributes on the user. The main idea is to offload as much as we can to Mongo (when using the local PDP) and avoid having to deal with all the users in Node.

How does that work?

## What does MongoDB actually check?

For an individual access decision, [`LocalPDP.canAccessObject`](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/pdp/LocalPDP.ts#L37-L59) does the positive version of that query. Using our room, the filter would look like this. This is a simplified example:

```javascript
const query = {
  _id: userId,
  $and: [
    {
      abacAttributes: {
        $elemMatch: { key: 'department', values: { $all: ['security'] } }
      }
    },
    {
      abacAttributes: {
        $elemMatch: { key: 'clearance', values: { $all: ['restricted'] } }
      }
    }
  ]
};
```

The important part is `$elemMatch`. Our attributes are an array of objects, so the key and its values must belong to the *same object*. Finding `department` somewhere in the array and `security` somewhere else wouldn't be enough. `$all` then requires every value listed for that key, while `$and` requires every room attribute to match. If the room asked for both `engineering` and `security` under `department`, the user would need both.

The [query builders](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/helper.ts#L354-L375) also produce the opposite condition: wrap each attribute match in `$not`, then combine those conditions with `$or`. In plain words: find someone missing *any* requirement. That's the version used when adding users and when finding members to remove after a room changes that we were discussing before.

Now, performance. This individual check includes an exact `_id`, so MongoDB has its [default `_id` index](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-single/) available to locate the user. The attribute predicates then determine whether that document qualifies. That's a very different amount of work from finding every non-compliant member of a large room. The operators may look similar, but the candidate set isn't.

The successful lookup projects only `_id`. We need to know that a matching user exists, so returning their profile, emails and everything else would just add data transfer and decoding work.  If the check fails, the PDP performs another lookup for the full user and returns it to the service as `userToRemove`, if that user still exists. So the rejected path can cost more than the successful one, even before removing the membership. Glad is the negative and shouldn't happen that often...

But, anyways, doing that query *every time* a user wants to read a message or participate in the room's conversation would be costly, so...

## The cache still does some work

Once the user is in the room, the [room access validator](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/packages/authorization/src/canAccessRoom.ts#L70-L89) checks the usual viewing permissions and calls `Abac.canAccessObject` for the ABAC decision. This is where we decide whether to ask the PDP again.

The [service first reads the user's subscription to that room](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/index.ts#L1139-L1200), projecting `abacLastTimeChecked`. No subscription, no access through this path. This is one of many shortcuts we could take thanks to our access structure. Since a user without a subscription cannot access a private room, then we can just omit the PDP access check for users that are not even in the room. Now, if the user is in the room, we have to re-evaluate on call, that's where the timed cache starts to work.

Everytime a positive access decision is made, we store the timestamp on the user subscription to the room. If the timestamp is recent enough, it returns `true` without asking the PDP. Otherwise, it checks PDP availability and requests a fresh decision. A successful decision writes a new timestamp to the subscription enabling the cache again.

So, the cache saves the *policy evaluation*. With Virtru, the fresh decision additionally involves an external request. When this check runs repeatedly, almost at every message sent, being able to skip it sometimes is gold.

The [configured default is 300 seconds](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/apps/meteor/ee/server/settings/abac.ts). Zero disables reuse. The timestamp belongs to a user-room subscription, so a grant for one room doesn't grant access to another. Cache hits also don't refresh that timestamp: the window runs from the last successful PDP check. Otherwise, someone who kept accessing the room could keep their old answer alive indefinitely. Very committed to being authorized.

Notice the order: the cache check comes *before* the PDP availability check. A still-valid cached grant can be used during an external PDP outage. Once it expires, an unavailable PDP or an evaluation error denies this access attempt. In [`VirtruPDP.canAccessObject`](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/pdp/VirtruPDP.ts#L163-L220), an explicit denial also requests removal; an inconclusive answer denies access without requesting removal. Not knowing the answer and knowing the user no longer qualifies lead to different membership actions.

> *What the heck is a subscription?* A subscription, in Rocket.Chat, represents the relation between a user and a room. When a user is "subscribed" to the room, it can participate on it and receive notifications. For private rooms, the ones covered by ABAC, a subscription must always exist in order to determine than the user is a member.

## What if the attributes change?

Going back to our example, imagine the user loses the `restricted` attribute on source. We should remove them from the security room, but our PDP reads from Mongo, so first we need LDAP to sync that change. Otherwise, even without the cache, we'd keep approving access with the attributes we still have stored, that's "staleness" and it's a problem in this type of security systems.

This happens in [`addSubjectAttributes`](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/index.ts#L347-L393). After saving the attributes, we check whether the user lost any values. That's what matters for this rule: if the user only gained attributes, they still satisfy every requirement they satisfied before. We can leave their memberships alone. Losing values, or having all their mapped attributes cleared, is what makes us check their rooms again.

> But, why that works?
> Good question. The main idea is simple: suppose you need to enter a physical room with a key and biometrics for one eye. The fact that you have 2 eyes doesn't change the security requirements. So same applies here: if on a sync the user diff presents that it only *obtained* new attributes, then we don't care about that. The basic set that allowed him to be in that room is preserved, so the access mantains.
> A similar case, but the opposite direction, happens when a room loses required attributes. If a room required A & B attributes, we know that all users on the room have at least A & B. If the room is later updated to require only A, we know all the users inside are still compliant. Another shortcut to save some CPU cycles.

We already know which rooms they belong to from `user.__rooms`, so the [local PDP](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/pdp/LocalPDP.ts) uses those IDs to query for rooms requiring a key or value the user is missing. In our example, that would include the security room because it still requires `restricted`. We get the affected rooms back from Mongo without having to fetch and compare each room separately in Node.

Now, if someone edits the *room's* attributes, we already have the room and need to find the affected users. That's the query with `__rooms: room._id` in `onRoomAttributesChanged`, combined with the non-compliant conditions from before. Thanks to the shortcut explained above, we know that we have to re-evaluate membership only when the attributes change in a way that makes them more restrictive.

This is why the simple matching rule was useful: we know which changes can actually invalidate a membership.

## You're no longer "topsecret"

For each affected membership, we call the [room service to remove the user](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/index.ts#L1319-L1424). Doing all of those calls at once could get ugly in a large room, so we use a shared `pLimit(20)`. Up to 20 removals can run concurrently through that limiter in this process; the rest wait.

There's still something I'd improve here. We collect the query results with `toArray()` and create the queued removal promises from them, so all those affected users are still in memory. We limited the running operations, but we haven't bounded the waiting work. That can become a problem if a change removes a large part of the room. I'll create a task for it.

A successful removal goes into the audit log. If it fails, we log the error and return `false`, while the other removals can still succeed. I'd want an admin to see which ones failed and be able to retry them, without having to go hunting through logs, but that's work for the future.

Once the user is removed, their subscription is gone. And since we check for that subscription *before* reusing a cached decision, the old grant won't get them back in. So we don't necessarily wait five minutes to revoke access: it's instant.

![A hand-drawn timeline shows a cached grant, an attribute change, sync, membership removal, and the original cache expiry.](/images/abac-cached-access.webp)

*One possible sequence: the LDAP change syncs and reevaluation removes the membership before the cached grant expires.*

## Dry runs

Now, before saving new room attributes, we want to show who would keep or lose access. The [preview service](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/index.ts#L881-L910) validates which attributes the editor can assign and evaluates those proposed requirements. The goal is to present the admins with information before making decisions.

The interesting case is adding a requirement to a room with thousands of members. Say we want to show only the ones losing access. We read 1,000 users, filter them in Node, and get two. That doesn't mean only two people would lose access. We might have another 800 further down the list, and now we have to keep reading just to fill the page. This is the main reason for not doing filtering at the application level: it gets nasty as more requirements arrive. Always try to leverage the database to do the filtering. That's their work.

So, we move the filter into the query. The [local preview](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/ee/packages/abac/src/pdp/LocalPDP.ts#L77-L114) uses the same compliant or non-compliant conditions we discussed before, depending on which group we want. It requests 1,001 matches, returns up to 1,000, and uses the extra result to know whether there's another page. That extra user is doing pagination work. Unpaid, probably.

The [member query](https://github.com/RocketChat/Rocket.Chat/blob/756135f4a99535b1bbc1f7e3779a1035dbd20450/packages/models/src/models/Users.ts#L171-L230) selects active users in the room, sorted by `username` and then `_id`. We keep both values from the last returned member as a cursor. The next query asks for usernames after that one, or the same username with a greater ID.

This avoids a growing `skip` offset, where Mongo has to [scan past earlier results before returning the next page](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/). The cursor gives us a place to continue, but the membership filter, attribute matching, sorting and optional name search still cost work. I'd check the query plan with representative room data before calling it fast, but we're very sure it's faster than doing this in Node :its_something:

We also run count queries for the range covered and, on the first page, the total candidate population. Those counts don't include the compliance filter, so `checked` and the number of matching users aren't the same thing. Even returning two people can involve more database work than the response suggests. When no group is selected, the local preview instead reads a bounded page of members and evaluates those users together.

![A proposed requirement branches to six members, with four checks and two crosses inside a dotted preview boundary.](/images/abac-membership-preview.webp)

*The preview uses the proposed requirements and current data. Attributes can still change before saving, and removals can fail afterward.*

The goal of this implementation is to be strong but at the same time, fast. We try to reuse as much as we can of the current access system, but adding a new layer on top with extra validations. The whole feature was partially (and then a bit more than partially) generated using AI.

As a reminder, using AI is not bad. It's like a knife. You can use it to stab people or maybe to create a sashimi. It depends on who uses it and how.
