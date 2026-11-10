export const premise = 'At 9:20 p.m., astronomer Dr. Adrian Vale is found dead beside his telescope. Four guests were still at the observatory. A storm has cut the road, but not the questions.';

export const suspects = [
  { id: 'mara', name: 'Mara Vale', role: 'The sister', detail: 'Adrian had cut her out of his will.' },
  { id: 'leo', name: 'Leo Bell', role: 'The engineer', detail: 'Adrian blamed him for a costly equipment failure.' },
  { id: 'nina', name: 'Nina Shaw', role: 'The archivist', detail: 'Adrian was about to publish research she said was hers.' },
  { id: 'otto', name: 'Otto Finch', role: 'The caterer', detail: 'Adrian had threatened to cancel his contract.' },
];

export const leads = [
  { id: 'lab', number: '01', title: 'Examine the cup', place: 'Observatory', text: 'The lab finds a fast-acting poison in Adrian’s cup. The tea left in the pot is clean. His doctor estimates he drank the poisoned tea at about 9:15. The investigation establishes that someone else poisoned him; his death was not suicide.' },
  { id: 'camera', number: '02', title: 'Check the cameras', place: 'East corridor', text: 'The observatory camera shows Adrian thoroughly wash his cup and pour tea from the pot at 9:08. His desk is outside its view. The uninterrupted corridor recording shows exactly one other person enter between then and 9:15. A glare hides their face, but their coat has three bright silver buttons.' },
  { id: 'coats', number: '03', title: 'Inspect the coat rack', place: 'Entrance hall', text: 'Tonight’s photographs show Nina wearing the only coat with three silver buttons. The coats stayed with their owners until the body was found.' },
  { id: 'log', number: '04', title: 'Read the door log', place: 'Control room', text: 'The observatory door records one guest entry between 9:08 and 9:15: Nina’s key card, at 9:12. The card remained in Nina’s possession all evening, according to the entrance attendant.' },
  { id: 'window', number: '05', title: 'Inspect the window', place: 'Observatory', text: 'The window was bolted from the inside before the dinner. Fresh dust on the sill is undisturbed. The corridor door is the room’s only other entrance.' },
  { id: 'notes', number: '06', title: 'Read the research notes', place: 'Archive', text: 'Adrian’s notes credit Nina with the discovery, but the version prepared for publication removes her name. A handwritten note in Adrian’s diary says he planned to send it at 10 p.m.' },
  { id: 'kitchen', number: '07', title: 'Question the kitchen', place: 'Kitchen', text: 'Otto says he delivered the tea pot at 9:05, then stayed in the kitchen preparing dessert. Two staff members confirm he did not leave until after 9:20.' },
  { id: 'generator', number: '08', title: 'Check the generator', place: 'Machine room', text: 'Leo and Mara were together in the generator room from 9:07 to 9:18. An automatic maintenance log and a live phone call with the utility company place them there.' },
];

export const solution = {
  suspect: 'nina',
  text: 'Nina poisoned the tea in Adrian’s cup. The clean pot and the timing point to the cup being tampered with after 9:08; the camera shows only one visitor in that window. Nina’s coat and her key-card entry identify that visitor. Her research notes explain a possible motive, but motive alone is not proof.',
};
