export const premise = 'At 9:20 p.m., astronomer Dr. Adrian Vale is found dead beside his telescope. Four guests were still at the observatory. The telescope room has one entrance: the corridor door. A storm has cut the road, but not the questions.';

export const suspects = [
  { id: 'mara', name: 'Mara Vale', role: 'The sister', detail: 'Adrian had cut her out of his will.' },
  { id: 'leo', name: 'Leo Bell', role: 'The engineer', detail: 'Adrian blamed him for a costly equipment failure.' },
  { id: 'nina', name: 'Nina Shaw', role: 'The archivist', detail: 'Adrian was about to publish research she said was hers.' },
  { id: 'otto', name: 'Otto Finch', role: 'The caterer', detail: 'Adrian had threatened to cancel his contract.' },
];

export const leads = [
  { id: 'lab', number: '01', title: 'Examine the cup', place: 'Observatory', text: 'The lab finds a fast-acting poison in the tea left in Adrian’s cup, but none in the pot. The investigation establishes that someone else poisoned him; his death was not suicide.' },
  { id: 'camera', number: '02', title: 'Check the door log', place: 'East corridor', text: 'The observatory door records three guest visits: card 14 from 9:10 to 9:11, card 27 from 9:13 until just before 9:14, and card 36 from 9:16 to 9:17. The log records no other entries. It shows card numbers, not names.' },
  { id: 'coats', number: '03', title: 'Inspect the card register', place: 'Entrance hall', text: 'At arrival, each guest received a numbered card: Mara 14, Leo 36, Nina 27, and Otto 52. The attendant saw each guest wearing their own card throughout the evening; none was exchanged.' },
  { id: 'log', number: '04', title: 'Trace Adrian’s movements', place: 'Control room', text: 'Footage shows Adrian rinse his cup and pour tea from the pot at 9:08. He carried it with him, except from 9:12 to 9:14, when he left it on his observatory desk to take a private call. He returned at 9:14 and kept it with him until he drank. No one touched the cup while he carried it.' },
  { id: 'window', number: '05', title: 'Inspect the window', place: 'Observatory', text: 'The window was bolted from the inside before the dinner. Fresh dust on the sill is undisturbed. The corridor door is the room’s only other entrance.' },
  { id: 'notes', number: '06', title: 'Read the research notes', place: 'Archive', text: 'Adrian’s notes credit Nina with the discovery, but the version prepared for publication removes her name. A handwritten note in Adrian’s diary says he planned to send it at 10 p.m.' },
  { id: 'kitchen', number: '07', title: 'Question the kitchen', place: 'Kitchen', text: 'Otto says he delivered the tea pot at 9:05, then stayed in the kitchen preparing dessert. Two staff members confirm he was there continuously from 9:12 to 9:14.' },
  { id: 'generator', number: '08', title: 'Check the generator', place: 'Machine room', text: 'Leo and Mara were together in the generator room from 9:12 to 9:14. An automatic maintenance log and a live phone call with the utility company place them there.' },
];

export const solution = {
  suspect: 'nina',
  text: 'Nina poisoned the tea in Adrian’s cup. The clean pot rules out poison in the tea before it was poured. Adrian kept the freshly rinsed cup with him except between 9:12 and 9:14. The door log places card 27 in the observatory during that interval, and the register assigns that card to Nina. The kitchen and generator alibis also place the other three suspects elsewhere during those two minutes. Nina’s research dispute gives her a possible motive, but motive alone is not proof.',
};
