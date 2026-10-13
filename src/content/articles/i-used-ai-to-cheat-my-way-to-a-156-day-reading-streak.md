---
idx: 20
title: "I used AI to cheat my way to a 156-day reading streak"
date: "2026-10-13T20:16:10Z"
slug: "i-used-ai-to-cheat-my-way-to-a-156-day-reading-streak"
tags: ["ai", "swift", "macos", "programming"]
excerpt: "I asked Codex to recover my Apple Books reading streak. Here is how a C bridge called private Swift APIs to turn two days into 156. Yes, this is cheating."
draft: false
unlisted: false
featured: false
canonicalUrl: "https://kevinaleman.com/i-used-ai-to-cheat-my-way-to-a-156-day-reading-streak"
coverImage: "https://kevinaleman.com/images/reading-streak-header.png"
devtoUrl: "https://dev.to/kaleman15/i-used-ai-to-cheat-my-way-to-a-156-day-reading-streak-1mh4"
---

I asked Codex to recover my Apple Books reading streak. Very important engineering work, obviously.

Books showed two days. I had an 80-day run in the history, then a gap, then a few scattered reading days. It happens to the best of us. The app was reporting exactly what it had recorded. I wanted the old streak back anyway, so I asked an agent to fill the gap.

It ended up showing **156 days** and **New Record**. I have read so much.

Before we go any further: **don't try this at home. This is cheating. Do actual reading.** The agent added reading time to dates that were below the goal. Those entries were manufactured. Nobody read 71 extra days while a script was running.

But the process was interesting. It involved private Swift APIs, backups, a background process, and, of course, a cache. Apparently even my questionable reading decisions need cache invalidation.

## Start with the embarrassing part

My daily goal was one minute. One minute. Apple Books was already being very generous with me. Had it on 15 mins a day, but I had to travel and reduced to 1 minute (talk about commitment issues).

The old streak ran from May 11 through July 29, 2026. Continuing it through October 13 would make 156 calendar days. Of those, 85 already met their goals: the original 80, plus five later dates. That left 71 dates to fill.

Seventy had no daily record. August 1 had six seconds, so it needed another 54. How do you even get six seconds of reading? IDK. A date that already met its goal needed no changes, even if it contained much more reading time.

The calculation was small enough:

```python
# Pseudocode
for day in requested_range:
    goal = stored_goal(day, default=60)
    recorded = recorded_seconds(day, default=0)
    additional = max(0, goal - recorded)

    if additional:
        increment_reading_time(day, additional, default_goal=60)
```

The dates also needed the correct timezone. The edits used `America/El_Salvador` and local noon, keeping each increment inside its intended calendar day. It would be a pretty annoying way to discover a timezone bug, after going through all this to change a number. A big part of this was possible (within the 5 hour window of my $20 codex subscription) thanks to the work previously done to understand the Apple books data model. Give it a read if you want to read about sqlite databases.

{% embed https://dev.to/kaleman15/the-apple-books-data-model-1f8h %}

Now, let's start.

## Make the backup before getting clever

The history file involved was:

```text
~/Library/Group Containers/group.com.apple.iBooks/CRDTModelLocalFile/ReadingHistoryModel
```

Before changing it, Codex backed up the history, its context and sync metadata, and the relevant Books preferences. The SQLite context databases were copied through SQLite's backup API. A permanent backup went into Documents, separate from the scratch files.

Then the experiments happened on copies. That was useful because some of the first attempts at calling Apple's private Swift code failed.

An agent having access to your files is a good reason to make the original easy to restore. Keep the backup somewhere separate, give it a name you understand, and be clear about which dates the agent is allowed to change. In this case, the scope was the missing goal time within one specific streak.

## The C bridge that called Apple's Swift code

This was the part I wanted to understand properly. Codex found an operation in the installed frameworks:

```text
ReadingHistoryModel.incrementReadingTime(date:amount:defaultGoal:)
```

But having a method name and calling the method are two separate problems. There was no available SDK module to import for this private interface. The tool used a C bridge to load the framework, resolve the Swift entry points, and call them with the required binary calling convention.

The calls went in both directions. The Swift driver called ordinary C functions declared in `native.h`. Those C functions called Apple's compiled Swift functions through typed function pointers. The framework was loaded at runtime with `dlopen`; the C object file was linked into the driver at build time.

Below is the complete C bridge used in this experiment, split into pieces so the explanation can stay next to the code. These are the actual functions and symbols used on this Mac. The Swift snippets are excerpts from the driver.

### Start with the C interface

**`native.h`**

```c
#include <stdint.h>
typedef struct { uint64_t a, b; } Bits;
void *history_decode(uint64_t a, uint64_t b);
Bits history_describe(void *model);
Bits history_encode(void *model);
void history_increment(void *model, double date, int64_t amount, int64_t goal);
void *history_error(void);
void *history_type(void);
void history_set_streak(void *model, void *dictionary_metadata, void *date, int64_t length);
```

`Bits` carries two 64-bit words across the C boundary. On this installation, that matched the representation used for the `Data` arguments and the `Data` and `String` results involved in these calls. Those words can contain storage references or inline information; they are the Swift value's representation, rather than a byte-buffer API.

The C interface exposes opaque pointers for the model and its metadata. The driver uses `history_error()` to retrieve a captured Swift error and `history_type()` when reflecting on the model later.

### Tell Clang how to call Swift

**`native.c` — attributes, function types, and symbol lookup**

```c
#include "native.h"
#include <dlfcn.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#define SWIFT __attribute__((swiftcall))
#define SELF __attribute__((swift_context))
#define ERROR __attribute__((swift_error_result))
#define RESULT __attribute__((swift_indirect_result))
typedef struct { void *value; uintptr_t state; } MetadataResponse;
typedef MetadataResponse (*MetadataFn)(uintptr_t) SWIFT;
typedef void (*DecodeFn)(void * RESULT, uint64_t, uint64_t, void *, void *, void * SELF, void ** ERROR) SWIFT;
typedef Bits (*BitsFn)(void * SELF) SWIFT;
typedef Bits (*EncodeFn)(void *, void *, void *, void *, void * SELF, void ** ERROR) SWIFT;
typedef void (*IncrementFn)(void *, int64_t, int64_t, void * SELF) SWIFT;
static void *metadata, *witness, *last_error;
void *history_error(void) { return last_error; }
void *history_type(void) { return metadata; }
static void *symbol(const char *name) {
    void *value = dlsym(RTLD_DEFAULT, name);
    if (!value) { fprintf(stderr, "Missing symbol: %s\n", name); exit(1); }
    return value;
}
```

The attributes carry the calling-convention information:

| Macro | Role in the bridge |
| --- | --- |
| `SWIFT` | Call the function using Swift's calling convention |
| `SELF` | Give the context parameter its special Swift ABI treatment |
| `RESULT` | Pass storage for an indirectly returned value |
| `ERROR` | Receive the error result from a throwing Swift call |

> ### What's ABI
>
> No, it's not the name of a girl ;) even tho it may be. ABI stands for Application Binary Interface. In short, it defines how already compiled Swift code interacts at the binary level and how the code talks to the runtime.
> Type layout conventions, representation, metadata, etc.
> You can find way more about this on the web, and probably better explained :)

Clang still needs a function type that describes the lowered arguments correctly. `swiftcall` handles their low-level placement; the bridge must supply indirect pointers, generic arguments, context, and error parameters in the right shape. The [Clang attribute reference](https://clang.llvm.org/docs/AttributeReference.html#swiftcall) documents this distinction.

The `symbol()` helper resolves an address with `dlsym`. The `$s...` strings are Swift's mangled symbol names. They carry information about the module, type, operation, and signature. One of the names used here can be inspected with:

```sh
xcrun swift-demangle --compact '$s13BookDataStore19ReadingHistoryModelV09incrementD4Time4date6amount11defaultGoaly10Foundation4DateV_S2itF'
```

The result identifies `ReadingHistoryModel.incrementReadingTime(date:amount:defaultGoal:)`. Finding that address gives us a place to call. The typedef determines how the call gets there.

### Decode a type C doesn't know about

**`native.c` — loading and decoding**

```c
void *history_decode(uint64_t a, uint64_t b) {
    assert(dlopen("/System/Library/PrivateFrameworks/BookDataStore.framework/BookDataStore", RTLD_NOW | RTLD_GLOBAL));
    MetadataFn meta = symbol("$s13BookDataStore19ReadingHistoryModelVMa");
    metadata = meta(0).value;
    void *(*conforms)(void *, void *) = symbol("swift_conformsToProtocol");
    witness = conforms(metadata, symbol("$s9Coherence4CRDTMp"));
    assert(metadata && witness);
    uintptr_t *vwt = ((uintptr_t **)metadata)[-1];
    size_t size = vwt[8];
    assert(size > 0 && size < 4096);
    void *model = calloc(1, size);
    void *error = NULL;
    DecodeFn decode = symbol("$s9Coherence4CRDTPAAE14serializedDatax10Foundation0D0V_tKcfC");
    decode(model, a, b, metadata, witness, metadata, &error);
    if (error) { last_error = error; return NULL; }
    fprintf(stderr, "Native model decoded (%zu bytes)\n", size);
    return model;
}
```

`dlopen` loads `BookDataStore`. `RTLD_GLOBAL` makes its loaded exports available to the subsequent `RTLD_DEFAULT` lookups; the required Coherence symbols were available through the loaded dependencies.

The metadata accessor returns the runtime type information for `ReadingHistoryModel`. `MetadataResponse` models its pointer-and-state result; `meta(0).value` keeps the metadata pointer. `swift_conformsToProtocol` then retrieves its conformance to `Coherence.CRDT`. That conformance is represented by a witness table: the information the generic decoder needs to use this particular type's implementation.

C also needs somewhere to put the decoded value. The pointer immediately before the metadata points to its value witness table, which includes layout and value-management information. The bridge reads the size slot used by this ABI, allocates storage, and passes it as the indirect result. The decoded model occupied 24 bytes in this run. Swift's [type metadata documentation](https://github.com/swiftlang/swift/blob/main/docs/ABI/TypeMetadata.rst) describes the metadata and value witness table relationship.

The decoder call has more arguments than its Swift source-level spelling suggests. It receives the output storage, the two `Data` words, generic type metadata, the protocol witness table, the initializer's metatype context, and the error result. The metadata pointer appears twice because those are distinct roles in this entry point.

The driver supplied the `Data` representation like this:

```swift
import Foundation

let arguments = CommandLine.arguments
guard arguments.count >= 3 else { fatalError("input output [increments.json]") }
let data = try Data(contentsOf: URL(fileURLWithPath: arguments[1]))
precondition(MemoryLayout<Data>.size == MemoryLayout<Bits>.size)
let bits = unsafeBitCast(data, to: Bits.self)
guard let model = history_decode(bits.a, bits.b) else {
    let error = unsafeBitCast(history_error()!, to: (any Error).self)
    print("Native decode failed: \(error)")
    exit(1)
}
```

`unsafeBitCast` reinterprets the value's bits. The size check catches a size mismatch, but it does not establish that an arbitrary Swift type can safely be passed this way. This bridge depended on the representation and ownership behavior of these specific calls.

### Inspect and serialize the model

**`native.c` — description and encoding**

```c
Bits history_describe(void *model) {
    BitsFn describe = symbol("$s13BookDataStore19ReadingHistoryModelV16debugDescriptionSSvg");
    return describe(model);
}
Bits history_encode(void *model) {
    EncodeFn encode = symbol("$s9Coherence11CRMergeableP14serializedData_7version10Foundation0D0VAA9CRContextC_AA16CRCodableVersionOtKFTj");
    void *(*conforms)(void *, void *) = symbol("swift_conformsToProtocol");
    void *mergeable_witness = conforms(metadata, symbol("$s9Coherence11CRMergeableMp"));
    assert(mergeable_witness);
    MetadataFn context_meta = symbol("$s9Coherence9CRContextCMa");
    void *(*create_context)(void * SELF) SWIFT = symbol("$s9Coherence9CRContextC6sharedACvgZ");
    void *context = create_context(context_meta(0).value);
    uint8_t version = *(uint32_t *)symbol("$s9Coherence16CRCodableVersionO8version3yA2CmFWC");
    void *error = NULL;
    Bits bits = encode(context, &version, metadata, mergeable_witness, model, &error);
    if (error) { last_error = error; return (Bits){0,0}; }
    return bits;
}
```

`history_describe` calls the model's debug-description getter. The Swift driver interprets the returned `Bits` as a `String` and uses that description in its round-trip checks.

Encoding uses a separate `CRMergeable` conformance, its serialization dispatch thunk, and the shared `CRContext`. The bridge resolves the installed enum case tag for `version3` and passes its address to the encoder. That tag lookup and argument representation were checked for this installation.

Both throwing calls start with a null error pointer. On failure, the bridge captures the returned error for the driver. On success, encoding returns the representation of a Swift `Data` value, which the driver writes to a scratch file and decodes again before any live replacement.

### The increment, and the pointer that mattered

**`native.c` — adding reading time**

```c
void history_increment(void *model, double date, int64_t amount, int64_t goal) {
    IncrementFn increment = symbol("$s13BookDataStore19ReadingHistoryModelV09incrementD4Time4date6amount11defaultGoaly10Foundation4DateV_S2itF");
    increment(&date, amount, goal, model);
}
```

This is the function that added the missing seconds. The driver already had the intended day and the amount needed to reach its goal:

```swift
history_increment(
    model,
    date.timeIntervalSinceReferenceDate,
    Int64(edit["amount"]!),
    60
)
```

The important detail in C is `increment(&date, amount, goal, model)`.

For this entry point on the installed build, Swift expected `Date` indirectly. Its storage contained the reference-date time interval, so the wrapper put that value in a local `double` and passed its address. The `model` pointer received the Swift context treatment specified by `SELF`. The `int64_t` arguments also assumed the 64-bit `Swift.Int` representation used on this Mac.

An earlier attempt declared the date as a directly passed `double`. The scratch process crashed inside `Calendar.component(_:from:)`, attempting to read address `0x3c`: decimal 60, one of the other argument values. The callee was reading the wrong thing as its date pointer. A small Swift probe compiled to LLVM IR confirmed the indirect date argument.

That's a fairly concrete reason to inspect the calling convention before trusting a function-pointer cast. The compiler can accept the cast while the call is still wrong.

### Update the record dictionary

**`native.c` — adding streak milestones**

```c
void history_set_streak(void *model, void *dictionary_metadata, void *date, int64_t length) {
    intptr_t (*offset)(void *, intptr_t) = symbol("swift_reflectionMirror_recursiveChildOffset");
    intptr_t field_offset = offset(metadata, 1);
    assert(field_offset == 8);
    void (*set)(void *, void *, void *, void * SELF) SWIFT = symbol("$s9Coherence15CRDictionary_v1Vyq_Sgxcis");
    set(date, &length, dictionary_metadata, (char *)model + field_offset);
}
```

The Swift driver reflected on the decoded model, checked that the selected field was named `streakRecords`, and obtained its dictionary type metadata. On this build, it was `CRDictionary_v1<Int, Date>`.

The C helper asks for the field's offset, asserts the observed eight-byte offset, and calls the installed dictionary setter. The setter gets the optional date value, the integer key, the dictionary metadata, and the address of the dictionary field as its Swift context.

The date argument here is a pointer to the actual Swift `Date?` representation. The driver prepared it with:

```swift
var date: Date? = start.addingTimeInterval(Double(length-1)*86400)
withUnsafeMutablePointer(to: &date) {
    history_set_streak(model, dictionaryMetadata, $0, Int64(length))
}
```

That allowed the native setter to add milestones 81 through 156 while keeping the existing records. The field index, offset, dictionary type, and symbol name are all assumptions that need checking on another build.

### Build the bridge and the driver

In the scratch directory, the build commands were:

```sh
clang -c native.c -o native.o

swiftc \
  -module-cache-path /private/tmp/books-streak-recovery/module-cache \
  -import-objc-header native.h \
  repair.swift native.o -o repair
```

`-import-objc-header` exposes the C declarations to the Swift driver; the header itself contains ordinary C. Linking `native.o` supplies those helper implementations. The private Swift entry points are resolved later, when the running tool loads the framework.

The full driver also handled the requested dates, error reporting, serialization, and verification. The snippets above focus on the language boundary.

### Keep the assumptions visible

This was a short-lived repair process with global state and build-specific layout assumptions. It leaves decoded allocations alive until process exit. A reusable library would need proper Swift value destruction, ownership and alignment handling, allocation checks, and a fuller error lifecycle. _But the goal is to not make this an habit and start reading like a functional human being_

There is also a very practical footgun in the actual code: `dlopen` sits inside `assert`. These builds had assertions enabled. Defining `NDEBUG` would remove the framework load along with the check; a maintained implementation should load it separately and handle failure explicitly.

The code is here because it explains what made the experiment work. It should also explain why I keep saying to leave your reading-history files alone.


## And then Books still said two days

After the daily entries were filled, Books recognized another completed day in the current week. The streak still said two days. The record still said 80.

Of course there was more state. It's Apple, there should be something else, somewhere.

Three pieces needed to agree:

- The daily history needed enough credited time for the missing dates.
- `streakRecords` needed the newly reached streak lengths and their dates.
- `ReadingHistory.CurrentStreak` needed the new cached count.

The record dictionary ended at 80 days. Codex preserved those entries and added milestones 81 through 156, dated July 30 through October 13. We had to populate this data too.

Swift reflection identified the record field and its dictionary type, and the bridge used the installed dictionary implementation's setter. Another check confirmed that these changes left the daily history unchanged. Finally, with Books closed, the cached count was updated:

```sh
BOOKS_PREFS="$HOME/Library/Containers/com.apple.iBooksX/Data/Library/Preferences/com.apple.iBooksX.plist"

defaults write "$BOOKS_PREFS" ReadingHistory.CurrentStreak -int 156
```

That command only handles the cache. The daily records and streak milestones had already been edited. `ReadingHistory.LastStreakDate` already contained `20261013`, so it stayed unchanged.

## Make the app use the edited history

Books and `bookdatastored` can keep history in memory. Editing the file while they're using it creates an opportunity for a later write to replace your changes. Then we had to close Books app for the cache to be read again.

Before replacement, the live daily history was compared with the version used to prepare the edits. The validated file was staged beside the live one, given the same permissions, flushed, and installed with `os.replace`. The cache was refreshed while Books remained closed.

Opening Books started the helper again. This time, Reading Goals showed **156 days**, a **156-day record**, and **New Record**.

The checks covered both the file and the app. The serialized output was decoded again, its model description was compared with the in-memory result, and every daily date, time, and goal was checked. The app then confirmed that it was displaying the intended result. FINALLY!

## The advice I should probably follow

There's an awkward connection to my last article about AI. I wrote about how much easier it is becoming to produce a result, and how we still need to pay attention to the work and understanding behind it:

{% embed https://dev.to/kaleman15/the-future-after-ai-2767 %}

Here I was, asking an agent to produce a very impressive number in a book app. It did the software work. It inspected the state, made the edits, and checked the result. My reading habit still needs me to open a book tomorrow, but I'll start from 156 rather than 2 ;)

If you want something practical to do with Books, [set a daily goal you can actually meet](https://support.apple.com/en-euro/guide/books/ibks7c41beea/9.0/mac/27). On the Mac, that's under Home → Reading Goals → Adjust Goal. Then read. After a missed day, start another streak.

Gotta be honest: my reading goal was `1 minute` and even with that low value, I couldn't do it (commitment issues? who?).

The fun lesson, as always, is: you can have the streak you want. It's just a number. The actual value is never in the milestone, is what you learn in the road :)
