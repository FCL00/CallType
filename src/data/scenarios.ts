import { Scenario, ExpectedFieldDefinition, AccountCategory, DifficultyLevel } from '../types';

export const INSURANCE_FIELDS: ExpectedFieldDefinition[] = [
  {
    key: 'customerName',
    label: 'Customer Name',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['name', 'caller'],
    hint: 'Full name of the policyholder calling'
  },
  {
    key: 'policyNumber',
    label: 'Policy Number',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['policy', 'pa-', 'ho-'],
    hint: 'Alphanumeric policy identifier'
  },
  {
    key: 'claimReferenceNumber',
    label: 'Claim Reference Number',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['claim', 'cl-', 'reference'],
    hint: 'Existing or new claim reference code'
  },
  {
    key: 'insuranceType',
    label: 'Insurance Type',
    expectedValue: '',
    required: true,
    type: 'select',
    options: ['Auto Insurance', 'Homeowners Insurance', 'Renters Insurance', 'Commercial Property'],
    hint: 'Coverage line being claimed'
  },
  {
    key: 'dateOfIncident',
    label: 'Date of Incident',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['date', 'when', 'incident'],
    hint: 'When the damage or accident occurred'
  },
  {
    key: 'reasonForCalling',
    label: 'Reason for Calling',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['status', 'claim', 'deductible', 'damage'],
    hint: 'Primary purpose stated by the customer'
  },
  {
    key: 'customerConcern',
    label: "Customer's Concern",
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['concern', 'deductible', 'water', 'repair', 'cost'],
    hint: 'What the caller is worried about or wants clarified'
  },
  {
    key: 'actionRequired',
    label: 'Action Required',
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['verify', 'adjuster', 'coverage', 'paperwork', 'inspection'],
    hint: 'Next steps for the support representative'
  },
  {
    key: 'callSummary',
    label: 'Call Summary',
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['summary', 'fender', 'pipe', 'ceiling'],
    hint: 'Concise overview of the interaction'
  },
  {
    key: 'additionalNotes',
    label: 'Additional Notes',
    expectedValue: '',
    required: false,
    type: 'textarea',
    keywords: ['photos', 'mitigation', 'valve', 'body shop'],
    hint: 'Secondary observations, contractor info, or inspection status'
  }
];

export const TICKETING_FIELDS: ExpectedFieldDefinition[] = [
  {
    key: 'customerName',
    label: 'Customer Name',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['name', 'purchaser'],
    hint: 'Full name on the ticket reservation'
  },
  {
    key: 'orderReferenceNumber',
    label: 'Order Reference Number',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['order', 'code', 'confirmation', 'tk-', 'ev-'],
    hint: 'Order code or confirmation reference'
  },
  {
    key: 'eventName',
    label: 'Event Name',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['festival', 'show', 'concert', 'broadway', 'horizon'],
    hint: 'Name of the festival, concert, or performance'
  },
  {
    key: 'eventDate',
    label: 'Event Date',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['date', 'tomorrow', 'month', 'night'],
    hint: 'Scheduled date and time of the event'
  },
  {
    key: 'numberOfTickets',
    label: 'Number of Tickets',
    expectedValue: '',
    required: true,
    type: 'number',
    keywords: ['passes', 'tickets', 'quantity'],
    hint: 'Total ticket count purchased'
  },
  {
    key: 'seatingSection',
    label: 'Seating Section',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['orchestra', 'passes', 'weekend', 'general', 'vip'],
    hint: 'Seat category, tier, or festival pass type'
  },
  {
    key: 'paymentStatus',
    label: 'Payment Status',
    expectedValue: '',
    required: true,
    type: 'select',
    options: ['Paid / Confirmed', 'Pending Verification', 'Declined', 'Refund Requested'],
    hint: 'Billing and transaction status'
  },
  {
    key: 'reasonForCalling',
    label: 'Reason for Calling',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['missing', 'barcode', 'tickets', 'email', 'inbox'],
    hint: 'Why the customer is contacting support'
  },
  {
    key: 'issueReported',
    label: 'Issue Reported',
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['barcodes', 'email', 'pdf', 'charged', 'delivery'],
    hint: 'Specific technical or delivery problem reported'
  },
  {
    key: 'resolutionRequired',
    label: 'Resolution Required',
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['resend', 'wallet', 'will-call', 'reissue', 'email'],
    hint: 'Customer outcome requested (e.g. mobile wallet link, will-call)'
  },
  {
    key: 'additionalNotes',
    label: 'Additional Notes',
    expectedValue: '',
    required: false,
    type: 'textarea',
    keywords: ['total', 'charged', 'urgent', 'box office'],
    hint: 'Financial amounts, deadlines, or customer tone observations'
  }
];

export const ECOMMERCE_FIELDS: ExpectedFieldDefinition[] = [
  {
    key: 'customerName',
    label: 'Customer Name',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['customer', 'name', 'shopper'],
    hint: 'Full name of the purchasing customer'
  },
  {
    key: 'orderNumber',
    label: 'Order Number',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['order', 'ec-', 'or-'],
    hint: 'Unique e-commerce order identifier'
  },
  {
    key: 'productName',
    label: 'Product Name',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['espresso', 'monitor', 'maker', 'gaming'],
    hint: 'Item or model being inquired about'
  },
  {
    key: 'purchaseDate',
    label: 'Purchase Date',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['monday', 'today', 'date'],
    hint: 'When the order was placed or received'
  },
  {
    key: 'trackingNumber',
    label: 'Tracking Number',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['tracking', 'order', 'courier', 'ec-', 'or-'],
    hint: 'Courier tracking reference or order tracking ID'
  },
  {
    key: 'deliveryStatus',
    label: 'Delivery Status',
    expectedValue: '',
    required: true,
    type: 'select',
    options: ['Out for Delivery', 'Delivered / Damaged', 'In Transit', 'Returned to Sender'],
    hint: 'Current shipping progress'
  },
  {
    key: 'reasonForCalling',
    label: 'Reason for Calling',
    expectedValue: '',
    required: true,
    type: 'text',
    keywords: ['delivery', 'tracking', 'damage', 'replacement', 'refund'],
    hint: 'Main reason customer reached out'
  },
  {
    key: 'customerConcern',
    label: "Customer's Concern",
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['passed', 'cracked', 'crushed', 'box', 'stopping', 'panel'],
    hint: 'Specific defect, delay, or carrier error'
  },
  {
    key: 'requestedResolution',
    label: 'Requested Resolution',
    expectedValue: '',
    required: true,
    type: 'textarea',
    keywords: ['rescheduled', 'replacement', 'label', 'prepaid', 'expedited'],
    hint: 'Customer requested fix (e.g., expedited replacement, delivery window)'
  },
  {
    key: 'additionalNotes',
    label: 'Additional Notes',
    expectedValue: '',
    required: false,
    type: 'textarea',
    keywords: ['van', 'work', 'warehouse', 'delay'],
    hint: 'Work urgency, courier behavior, or return constraints'
  }
];

function createScenario(
  data: Omit<Scenario, 'fieldDefinitions'>,
  fieldSchema: ExpectedFieldDefinition[]
): Scenario {
  return {
    ...data,
    fieldDefinitions: fieldSchema.map((f) => ({
      ...f,
      expectedValue: data.expectedForm[f.key] || ''
    }))
  };
}

export const SCENARIOS: Scenario[] = [
  // Insurance 1
  createScenario(
    {
      id: 'insurance-calm-female-01',
      category: 'insurance',
      voiceOptionId: 'voice-insurance-calm-female',
      title: 'Auto Claim Deductible & Repair Status',
      difficulty: 'beginner',
      durationEstimate: '~26 sec',
      audioUrl: '/audio/insurance/insurance-calm-female-01.mp3',
      customerName: 'Eleanor Vance',
      scenarioSummary:
        'A policyholder calls to check on an auto claim status, verify her five hundred dollar deductible, and confirm that photos were reviewed before authorizing bumper repairs.',
      keyDetails: [
        'Claim Ref: CL-88429',
        'Policy Number: PA-40912',
        'Deductible: $500',
        'Incident: Fender bender last Thursday'
      ],
      transcript:
        'Hello, my name is Eleanor Vance, and I am calling to check on the status of my auto insurance claim. The claim reference number is CL-88429, filed under policy number PA-40912. I had a minor fender bender last Thursday, and I wanted to verify whether my five hundred dollar deductible applies before I authorize the repair shop to proceed with the bumper replacement. Could you please check if the adjuster has reviewed the inspection photos?',
      expectedForm: {
        customerName: 'Eleanor Vance',
        policyNumber: 'PA-40912',
        claimReferenceNumber: 'CL-88429',
        insuranceType: 'Auto Insurance',
        dateOfIncident: 'Last Thursday',
        reasonForCalling: 'Check status of auto insurance claim and verify deductible',
        customerConcern: 'Verify if five hundred dollar deductible applies before authorizing repair shop bumper replacement',
        actionRequired: 'Check if insurance adjuster has reviewed inspection photos and verify deductible status',
        callSummary: 'Caller had minor fender bender last Thursday; needs photo review and deductible confirmation for bumper repair',
        additionalNotes: 'Repair shop awaiting authorization; photos submitted for adjuster review'
      }
    },
    INSURANCE_FIELDS
  ),

  // Insurance 2
  createScenario(
    {
      id: 'insurance-concerned-male-01',
      category: 'insurance',
      voiceOptionId: 'voice-insurance-concerned-male',
      title: 'Homeowners Emergency Water Damage Claim',
      difficulty: 'intermediate',
      durationEstimate: '~28 sec',
      audioUrl: '/audio/insurance/insurance-concerned-male-01.mp3',
      customerName: 'David Miller',
      scenarioSummary:
        'A concerned homeowner reports an upstairs pipe burst leaking through the kitchen ceiling, asking about emergency repair mitigation coverage and contractor paperwork.',
      keyDetails: [
        'Policy Number: HO-77319',
        'Incident: Burst pipe upstairs bathroom',
        'Damage: Ceiling & kitchen water leak',
        'Status: Main valve shut, drying crew on site'
      ],
      transcript:
        "Hi there, my name is David Miller. I'm calling about my homeowners policy, number HO-77319. We had a sudden pipe burst in our upstairs bathroom yesterday morning, and there is water leaking down through the ceiling into our kitchen. I've already turned off the main water valve and hired an emergency drying crew, but I need to make sure this mitigation work is covered under our emergency repairs clause. What paperwork does the restoration contractor need to submit directly to you?",
      expectedForm: {
        customerName: 'David Miller',
        policyNumber: 'HO-77319',
        claimReferenceNumber: 'HO-77319',
        insuranceType: 'Homeowners Insurance',
        dateOfIncident: 'Yesterday morning',
        reasonForCalling: 'Report water damage from sudden pipe burst and check emergency repair coverage',
        customerConcern: 'Water leaking through kitchen ceiling and ensuring mitigation drying crew is covered under policy',
        actionRequired: 'Confirm coverage under emergency repairs clause and provide paperwork requirements for restoration contractor',
        callSummary: 'Pipe burst in upstairs bathroom yesterday morning leaking into kitchen; main valve shut; drying crew hired',
        additionalNotes: 'Main water valve turned off; emergency drying crew on site; contractor paperwork needed'
      }
    },
    INSURANCE_FIELDS
  ),

  // Ticketing 1
  createScenario(
    {
      id: 'ticketing-energetic-male-01',
      category: 'ticketing',
      voiceOptionId: 'voice-ticketing-energetic-male',
      title: 'Music Festival Weekend Passes Confirmation',
      difficulty: 'intermediate',
      durationEstimate: '~24 sec',
      audioUrl: '/audio/ticketing/ticketing-energetic-male-01.mp3',
      customerName: 'Jordan Brooks',
      scenarioSummary:
        'An enthusiastic customer bought four festival passes for eight hundred and forty dollars, requesting email address verification and a resend of digital barcodes to his mobile wallet.',
      keyDetails: [
        'Confirmation Code: TK-93021',
        'Event: Horizon Summer Music Festival',
        'Quantity: 4 weekend passes',
        'Total: $840 charged'
      ],
      transcript:
        "Hey, good morning! My name is Jordan Brooks, and I'm super excited because I just bought four weekend passes for the Horizon Summer Music Festival next month! My confirmation code is TK-93021. The purchase went through on my credit card for eight hundred and forty dollars, but the PDF bar codes haven't hit my email inbox yet. Can you please verify my email address and resend the digital pass link to my mobile wallet?",
      expectedForm: {
        customerName: 'Jordan Brooks',
        orderReferenceNumber: 'TK-93021',
        eventName: 'Horizon Summer Music Festival',
        eventDate: 'Next month',
        numberOfTickets: '4',
        seatingSection: 'Weekend Passes',
        paymentStatus: 'Paid / Confirmed',
        reasonForCalling: 'Inquire about missing PDF barcodes for festival passes',
        issueReported: 'Credit card charged eight hundred and forty dollars but PDF barcodes not received in email inbox',
        resolutionRequired: 'Verify customer email address and resend digital pass link directly to mobile wallet',
        additionalNotes: 'Customer purchased four weekend passes for $840; eager to receive mobile wallet pass'
      }
    },
    TICKETING_FIELDS
  ),

  // Ticketing 2
  createScenario(
    {
      id: 'ticketing-frustrated-female-01',
      category: 'ticketing',
      voiceOptionId: 'voice-ticketing-frustrated-female',
      title: 'Missing Theater Orchestra Tickets for Tomorrow',
      difficulty: 'advanced',
      durationEstimate: '~27 sec',
      audioUrl: '/audio/ticketing/ticketing-frustrated-female-01.mp3',
      customerName: 'Patricia Hayes',
      scenarioSummary:
        'A customer has an 8:00 PM show tomorrow and has not received the orchestra tickets billed two weeks ago, insisting on immediate reissuance or box office will-call pickup.',
      keyDetails: [
        'Reservation Number: EV-51870',
        'Customer: Patricia Hayes',
        'Performance: Tomorrow at 8:00 PM',
        'Total Paid: $320 billed 2 weeks ago'
      ],
      transcript:
        "Hello, this is Patricia Hayes. I'm calling because the evening show is tomorrow night at eight, and I still have not received my reserved orchestra tickets. My reservation number is EV-51870 under Patricia Hayes. I was billed three hundred and twenty dollars two weeks ago, and your automated system told me they would be delivered electronically within twenty-four hours. I really need you to reissue these tickets right now or arrange for box office will-call pickup so we don't get turned away at the door.",
      expectedForm: {
        customerName: 'Patricia Hayes',
        orderReferenceNumber: 'EV-51870',
        eventName: 'Evening Show / Theater Performance',
        eventDate: 'Tomorrow night at 8:00 PM',
        numberOfTickets: '2',
        seatingSection: 'Reserved Orchestra',
        paymentStatus: 'Paid / Confirmed',
        reasonForCalling: 'Missing reserved orchestra tickets for tomorrow night show',
        issueReported: 'Billed three hundred and twenty dollars two weeks ago with 24-hr delivery promise, but tickets never arrived',
        resolutionRequired: 'Reissue tickets electronically immediately or arrange box office will-call pickup',
        additionalNotes: 'Customer paid $320 two weeks ago; event is tomorrow at 8 PM; urgent delivery required to prevent being turned away'
      }
    },
    TICKETING_FIELDS
  ),

  // E-commerce 1
  createScenario(
    {
      id: 'ecommerce-friendly-female-01',
      category: 'ecommerce',
      voiceOptionId: 'voice-ecommerce-friendly-female',
      title: 'Espresso Maker Out-for-Delivery Inquiry',
      difficulty: 'beginner',
      durationEstimate: '~23 sec',
      audioUrl: '/audio/ecommerce/ecommerce-friendly-female-01.mp3',
      customerName: 'Sarah Jenkins',
      scenarioSummary:
        'A polite buyer tracking her espresso machine package after a delivery truck passed by without stopping, checking whether the driver will return or if it is rescheduled.',
      keyDetails: [
        'Order Number: EC-44182',
        'Item: Espresso Maker',
        'Ordered: Last Monday',
        'Status: Out for delivery by 4 PM'
      ],
      transcript:
        'Hi, good afternoon! My name is Sarah Jenkins. I ordered an espresso maker last Monday, and the order number is EC-44182. The tracking notification said it was out for delivery by four o\'clock today, but the courier van just drove past without stopping. I just wanted to verify if it was rescheduled for tomorrow or if the driver might still come back before seven this evening. Thank you so much for checking on this for me!',
      expectedForm: {
        customerName: 'Sarah Jenkins',
        orderNumber: 'EC-44182',
        productName: 'Espresso Maker',
        purchaseDate: 'Last Monday',
        trackingNumber: 'EC-44182',
        deliveryStatus: 'Out for Delivery',
        reasonForCalling: 'Check package status after courier van passed without stopping',
        customerConcern: 'Tracking said out for delivery by 4 PM but courier van drove past house without stopping',
        requestedResolution: 'Verify if delivery is rescheduled for tomorrow or if driver will return before 7 PM',
        additionalNotes: 'Customer ordered last Monday; willing to receive delivery until 7:00 PM'
      }
    },
    ECOMMERCE_FIELDS
  ),

  // E-commerce 2
  createScenario(
    {
      id: 'ecommerce-impatient-male-01',
      category: 'ecommerce',
      voiceOptionId: 'voice-ecommerce-impatient-male',
      title: 'Crushed Gaming Monitor Return & Replacement',
      difficulty: 'advanced',
      durationEstimate: '~26 sec',
      audioUrl: '/audio/ecommerce/ecommerce-impatient-male-01.mp3',
      customerName: 'Marcus Reid',
      scenarioSummary:
        'A customer received a cracked 32-inch gaming monitor in a crushed box, demanding an immediate expedited replacement and prepaid return label before his work tomorrow.',
      keyDetails: [
        'Order Number: OR-62095',
        'Item: 32-inch gaming monitor',
        'Condition: Shipping box crushed, screen panel cracked',
        'Request: Expedited replacement & prepaid return label'
      ],
      transcript:
        'Hi, listen, my name is Marcus Reid. I received order number OR-62095 earlier today, which was supposed to be a thirty-two inch gaming monitor, but the shipping box was crushed and the screen panel is completely cracked. I need to start a return and get a replacement unit expedited immediately, because I need this display for my work tomorrow. Can you email me a prepaid return shipping label and confirm that my replacement won\'t be delayed until the broken one gets back to your warehouse?',
      expectedForm: {
        customerName: 'Marcus Reid',
        orderNumber: 'OR-62095',
        productName: '32-inch Gaming Monitor',
        purchaseDate: 'Earlier today',
        trackingNumber: 'OR-62095',
        deliveryStatus: 'Delivered / Damaged',
        reasonForCalling: 'Received damaged gaming monitor with cracked screen panel in crushed box',
        customerConcern: 'Shipping box was crushed and screen panel is cracked; customer urgently needs display for work tomorrow',
        requestedResolution: 'Email prepaid return shipping label and expedite replacement immediately without waiting for return to warehouse',
        additionalNotes: 'Customer needs display for work tomorrow; replacement must be expedited without return warehouse delay'
      }
    },
    ECOMMERCE_FIELDS
  )
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getScenariosByCategory(category: string): Scenario[] {
  return SCENARIOS.filter((s) => s.category === category);
}

export function getScenariosByVoice(voiceId: string): Scenario[] {
  return SCENARIOS.filter((s) => s.voiceOptionId === voiceId);
}
