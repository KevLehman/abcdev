export const premise = 'The storm has closed the road to the observatory. At 9:20 p.m., Dr. Adrian Vale is found dead beside his telescope. Four guests are still inside. The telescope room has only one entrance: the corridor door.';

export const suspects = [
  { id: 'mara', name: 'Mara Vale', role: 'The sister', detail: 'Adrian had cut her out of his will.' },
  { id: 'leo', name: 'Leo Bell', role: 'The engineer', detail: 'Adrian blamed him for a costly equipment failure.' },
  { id: 'nina', name: 'Nina Shaw', role: 'The archivist', detail: 'Adrian was about to publish research she said was hers.' },
  { id: 'otto', name: 'Otto Finch', role: 'The caterer', detail: 'Adrian had threatened to cancel his contract.' },
];

export const leads = [
  { id: 'lab', number: '01', title: 'Examine the cup', place: 'Observatory', text: 'The tea left in Adrian’s cup contains a fast-acting poison. The tea in the pot is clean. Investigators have ruled out suicide; someone else poisoned him.' },
  { id: 'camera', number: '02', title: 'Check the door log', place: 'East corridor', text: 'Three guest visits appear in the observatory door log: card 14 from 9:10 to 9:11, card 27 from 9:13 until just before 9:14, and card 36 from 9:16 to 9:17. There are no other entries. The log gives card numbers, not names.' },
  { id: 'coats', number: '03', title: 'Inspect the card register', place: 'Entrance hall', text: 'The register lists the cards issued at arrival: Mara 14, Leo 36, Nina 27, and Otto 52. The attendant saw each guest wearing their own card throughout the evening. None was exchanged.' },
  { id: 'log', number: '04', title: 'Trace Adrian’s movements', place: 'Control room', text: 'At 9:08, footage shows Adrian rinse his cup and pour tea from the pot. He carried it until 9:12, then left it on his observatory desk to take a private call. He returned at 9:14 and kept the cup with him until he drank. No one touched it while he was carrying it.' },
  { id: 'window', number: '05', title: 'Inspect the window', place: 'Observatory', text: 'The window was bolted from the inside before dinner. A layer of fresh dust on the sill is undisturbed. The corridor door is the room’s only other entrance.' },
  { id: 'notes', number: '06', title: 'Read the research notes', place: 'Archive', text: 'Adrian’s notes credit Nina with the discovery. The version prepared for publication leaves out her name. In his diary, Adrian wrote that he planned to send it at 10 p.m.' },
  { id: 'kitchen', number: '07', title: 'Question the kitchen', place: 'Kitchen', text: 'Otto says he delivered the tea pot at 9:05 and stayed in the kitchen afterward to prepare dessert. Two staff members confirm he was there continuously from 9:12 to 9:14.' },
  { id: 'generator', number: '08', title: 'Check the generator', place: 'Machine room', text: 'Leo and Mara were together in the generator room from 9:12 to 9:14. A maintenance log and a live phone call with the utility company place them there.' },
];

export const solution = {
  suspect: 'nina',
  text: 'Nina poisoned Adrian’s tea. The pot was clean, and Adrian had rinsed the cup himself. He kept it with him until 9:12, when he left it on his desk to take a call. Two minutes later he returned, picked it up, and eventually drank. During those two minutes, card 27 entered the observatory. The register assigns that card to Nina. The other three suspects were accounted for in the kitchen and generator room. The dispute over the research gave Nina a motive; the door log puts her in the room.',
};
