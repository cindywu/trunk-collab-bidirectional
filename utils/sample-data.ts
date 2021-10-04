import { IReference } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'

// export const sampleReferenceData: IReference[] = [
//   {
//     id: uuidv4(),
//     name: 'Clery 2013',
//     parent: 'Wurzel 202X',
//     date: 'Apr 10',
//     description: 'someone said i should read this',
//     labels: [
//       {
//         id: uuidv4(),
//         name: 'Book',
//         color: '#D8EDF2'
//       },
//       {
//         id: uuidv4(),
//         name: 'Missing',
//         color: '#DB615D'
//       }
//     ],
//     comments: [
//       {
//         id: uuidv4(),
//         user: '@cindy',
//         content: 'why are we reading this?'
//       }
//     ]
//   },
//   {
//     id: uuidv4(),
//     name: 'Bromberg 1982',
//     parent: 'Wurzel 202X',
//     date: 'Apr 10',
//     description: 'someone said i should read this',
//     labels: [
//       {
//         id: uuidv4(),
//         name: 'Missing',
//         color: '#DB615D'
//       }
//     ],
//     comments: [
//       {
//         id: uuidv4(),
//         user: '@cindy',
//         content: 'why are we reading this?'
//       }
//     ]
//   },
//   {
//     id: uuidv4(),
//     name: 'Wurden 2016',
//     parent: 'Wurzel 202X',
//     date: 'Apr 10',
//     description: 'someone said i should read this',
//     labels: [
//       {
//         id: uuidv4(),
//         name: 'Journal article',
//         color: '#EDC963'
//       }
//     ],
//     comments: [
//       {
//         id: uuidv4(),
//         user: '@cindy',
//         content: 'why are we reading this?'
//       }
//     ]
//   },
//   {
//     id: uuidv4(),
//     name: 'Kirpatrick 1995',
//     parent: 'Wurzel 202X',
//     date: 'Apr 10',
//     description: 'someone said i should read this',
//     labels: [
//       {
//         id: uuidv4(),
//         name: 'Journal article',
//         color: '#EDC963'
//       }
//     ],
//     comments: [
//       {
//         id: uuidv4(),
//         user: '@cindy',
//         content: 'why are we reading this?'
//       }
//     ]
//   },
//   {
//     id: uuidv4(),
//     name: 'Harchol et al. 2020',
//     parent: '',
//     date: 'Apr 10',
//     description: 'A public option for the core',
//     labels: [
//       {
//         id: uuidv4(),
//         name: 'Journal article',
//         color: '#EDC963'
//       }
//     ],
//     comments: [
//       {
//         id: uuidv4(),
//         user: 'cindy',
//         content: 'GPT-3 summary: In the past, all the big companies who make up the Internet used to work together to help find new ways to build more Internet, but now they are all fighting against each other.'
//       },
//       {
//         id: uuidv4(),
//         user: 'jsoares',
//         content: 'Kids today... ^_^'
//       },
//       {
//         id: uuidv4(),
//         user: 'jsoares',
//         content: `This isn't new: most of the non-US Tier1 ISPs (TeliaSonera, Telefonica, Deutsche Telekom, Telecom Italia, NTT, ...) were once public.`
//       },
//       {
//         id: uuidv4(),
//         user: 'jsoares',
//         content: `This isn't new: most of the non-US Tier1 ISPs (TeliaSonera, Telefonica, Deutsche Telekom, Telecom Italia, NTT, ...) were once public.`
//       },
//       {
//         id: uuidv4(),
//         user: 'jsoares',
//         content: "(public as in state-owned)"
//       },
//       {
//         id: uuidv4(),
//         user: 'karolakirsanow',
//         content: `"Abundant supply and increasing competition have led to robust price erosion throughout the global bandwidth market. New 100 Gbps equipped submarine cable systems and upgrades to existing networks have further lowered unit costs"`
//       },
//       {
//         id: uuidv4(),
//         user: 'karolakirsanow',
//         content: `naive Q: how much of the internet's traffic is google and amazon sending packets to themselves?`
//       },
//       {
//         id: uuidv4(),
//         user: 'willscott',
//         content: `There's a disconnect here. the observation is that lots of traffic in individual wide area providers networks stays within their network now. The top level public core that is proposed does not compete with that trend - a google would still be motivated to lease direct lines between its disparate data centers since it can predict traffic needs and gains extra control by having that infrastructure fully under its control. Its hard to imagine that there's an economy of scale these large content providers are missing out on where they'd be economically motivated to offload that traffic back into public core. On the other hand the end user traffic to content providers still goes through 'the public internet' in so much as BGP is still in play. the public internet has just shrunk to the meet-me room at the local POP rather than backhaul links.`
//       },
//       {
//         id: uuidv4(),
//         user: 'jsoares',
//         content: `The observation is still relevant but I agree with Will's point. I don't know the answer to Karola's question but I wouldn't imagine it to be /that/ substantial. It is definitely a big (absolute) number given the scale of both services; however, it would be a very bad sign for their engineering if the inter-DC traffic overhead (as in inter-data-centre traffic / user traffic) was high. OVER-simplifying an example, YouTube only needs to transfer a new video to each DC once, from where it will be downloaded by millions of people afterwards. A more interesting question is e.g. how much of the trans-oceanic traffic consists of cloud providers moving data around? I'd expect that fraction to be a lot higher, because this model of distributed data centers greatly reduces the need for trans-oceanic user traffic even as it increases trans-oceanic inter-DC traffic.`
//       },
//       {
//         id: uuidv4(),
//         user: 'evan',
//         content: `I think the connection the authors imply later in the paper is that a public internet that this paragraph describes is more susceptible to net neutrality violations (since e.g. google can prioritize google traffic on their links)`
//       },
//     ]
//   }
// ]