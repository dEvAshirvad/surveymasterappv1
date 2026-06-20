// web/src/forms/forms.ts
// Single source of truth for ALL survey forms.
// Section A is complete. B–N + O are stubs — fill in `order[]` from the PDF the same way as A.
//
// Rules baked into this anatomy:
//  - No "boolean" type. Yes/No is an `options` question, so every stored value is a string
//    and triggerValue comparison (answers[parentId] === triggerValue) never breaks.
//  - Flat qids: A1.1, A1.2, ... A2.1. Array position = render order, no `ord` field.
//  - Conditionals are normal numbered questions carrying parentId + triggerValue.
//  - The Gap Matrix is ONE `matrix` question, never expanded to one-question-per-cell.

import type { FormDef } from "./types";
import { withSchemeNoneOption } from "./scheme-options";

const yesNo = [
  { value: "Yes", label: { en: "Yes", hi: "हां" } },
  { value: "No", label: { en: "No", hi: "नहीं" } },
];

const requirementMatrixCols = [
  { value: "item", label: { en: "Item", hi: "वस्तु" } },
  { value: "required", label: { en: "Required (nos)", hi: "आवश्यक (संख्या)" }, inputType: "number" as const },
  { value: "estCost", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" }, inputType: "number" as const },
];

const rawFormSchemeOptions: Record<string, Array<{ value: string; label: { en: string; hi: string } }>> = {
  A: [
    { value: "A_SCHEME_1", label: { en: "A Scheme 1", hi: "A योजना 1" } },
    { value: "A_SCHEME_2", label: { en: "A Scheme 2", hi: "A योजना 2" } },
  ],
  B: [
    { value: "B_SCHEME_1", label: { en: "B Scheme 1", hi: "B योजना 1" } },
    { value: "B_SCHEME_2", label: { en: "B Scheme 2", hi: "B योजना 2" } },
  ],
  C: [
    { value: "C_SCHEME_1", label: { en: "C Scheme 1", hi: "C योजना 1" } },
    { value: "C_SCHEME_2", label: { en: "C Scheme 2", hi: "C योजना 2" } },
  ],
  D: [
    { value: "D_SCHEME_1", label: { en: "D Scheme 1", hi: "D योजना 1" } },
    { value: "D_SCHEME_2", label: { en: "D Scheme 2", hi: "D योजना 2" } },
  ],
  E: [
    { value: "E_SCHEME_1", label: { en: "E Scheme 1", hi: "E योजना 1" } },
    { value: "E_SCHEME_2", label: { en: "E Scheme 2", hi: "E योजना 2" } },
  ],
  F: [
    { value: "F_SCHEME_1", label: { en: "F Scheme 1", hi: "F योजना 1" } },
    { value: "F_SCHEME_2", label: { en: "F Scheme 2", hi: "F योजना 2" } },
  ],
  G: [
    { value: "G_SCHEME_1", label: { en: "G Scheme 1", hi: "G योजना 1" } },
    { value: "G_SCHEME_2", label: { en: "G Scheme 2", hi: "G योजना 2" } },
  ],
  H: [
    { value: "H_SCHEME_1", label: { en: "H Scheme 1", hi: "H योजना 1" } },
    { value: "H_SCHEME_2", label: { en: "H Scheme 2", hi: "H योजना 2" } },
  ],
  I: [
    { value: "I_SCHEME_1", label: { en: "I Scheme 1", hi: "I योजना 1" } },
    { value: "I_SCHEME_2", label: { en: "I Scheme 2", hi: "I योजना 2" } },
  ],
  J: [
    { value: "J_SCHEME_1", label: { en: "J Scheme 1", hi: "J योजना 1" } },
    { value: "J_SCHEME_2", label: { en: "J Scheme 2", hi: "J योजना 2" } },
  ],
  K: [
    { value: "K_SCHEME_1", label: { en: "K Scheme 1", hi: "K योजना 1" } },
    { value: "K_SCHEME_2", label: { en: "K Scheme 2", hi: "K योजना 2" } },
  ],
  L: [
    { value: "L_SCHEME_1", label: { en: "L Scheme 1", hi: "L योजना 1" } },
    { value: "L_SCHEME_2", label: { en: "L Scheme 2", hi: "L योजना 2" } },
  ],
  M: [
    { value: "M_SCHEME_1", label: { en: "M Scheme 1", hi: "M योजना 1" } },
    { value: "M_SCHEME_2", label: { en: "M Scheme 2", hi: "M योजना 2" } },
  ],
  N: [
    { value: "N_SCHEME_1", label: { en: "N Scheme 1", hi: "N योजना 1" } },
    { value: "N_SCHEME_2", label: { en: "N Scheme 2", hi: "N योजना 2" } },
  ],
  O: [
    { value: "O_SCHEME_1", label: { en: "O Scheme 1", hi: "O योजना 1" } },
    { value: "O_SCHEME_2", label: { en: "O Scheme 2", hi: "O योजना 2" } },
  ],
};

const formSchemeOptions = Object.fromEntries(
  Object.entries(rawFormSchemeOptions).map(([key, options]) => [
    key,
    withSchemeNoneOption(options),
  ]),
) as typeof rawFormSchemeOptions;

export const FORMS: FormDef[] = [
  // ============================================================
  // SECTION A — DRINKING WATER SUPPLY  (complete)
  // ============================================================
  {
    code: "A",
    title: { en: "Drinking Water Supply", hi: "पेयजल आपूर्ति" },
    ruleRef: "Rule 22(2)(a) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Centralized purification systems, water treatment plants, permanent/temporary water distribution networks, standalone facilities (handpumps, borewells, OHTs), laying of piped water supply systems.",
      hi: "पात्र: केंद्रीकृत शुद्धिकरण प्रणाली, जल उपचार संयंत्र, स्थायी/अस्थायी जल वितरण नेटवर्क, स्वतंत्र सुविधाएं (हैंडपंप, बोरवेल, ओएचटी), पाइपलाइन जल आपूर्ति प्रणाली बिछाना।",
    },
    order: [
      {
        title: {
          en: "A1. Village water infrastructure status",
          hi: "ए1. गांव की जल अवसंरचना स्थिति",
        },
        questions: [

          {
            qid: "A1.1",
            title: {
              en: "Does the village have a piped water supply scheme?",
              hi: "क्या गांव में पाइप के जरिए पानी की आपूर्ति की व्यवस्था है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: {
              en: "Laying of piped water supply system",
              hi: "पाइपलाइन द्वारा जल आपूर्ति प्रणाली बिछाना",
            },
            parentId: null,
          },
          {
            qid: "A1.5",
            title: {
              en: "Average daily water supply duration and per-capita supply",
              hi: "औसत दैनिक जल आपूर्ति अवधि और प्रति व्यक्ति आपूर्ति",
            },
            type: "options",
                uom:{ en: "Hrs/day; LPCD", hi: "घंटे/दिन; एलपीसीडी" },
                options: [
                  { value: "1", label: { en: "<=1 Hrs/day", hi: "<=1 घंटे/दिन" } },
                  { value: "2", label: { en: "<=2 Hrs/day", hi: "<=2 घंटे/दिन" } },
                  { value: "3", label: { en: "<=3 Hrs/day", hi: "<=3 घंटे/दिन" } },
                  { value: "4", label: { en: "<=4 Hrs/day", hi: "<=4 घंटे/दिन" } },
                ],
            parentId: null,
          },
          {
            qid: "A1.6",
            title: {
              en: "Is supply adequate throughout the year or seasonal?",
              hi: "क्या आपूर्ति पूरे वर्ष पर्याप्त है या मौसमी?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: { en: "Temporary distribution network", hi: "अस्थायी वितरण नेटवर्क" },
            parentId: null,
          },
          {
            qid: "A1.7",
            title: { en: "Months of disruption", hi: "व्यवधान के महीने" },
            type: "text",
            uom: { en: "Months", hi: "महीने" },
            parentId: "A1.6",
            triggerValue: "Seasonal",
          },
        ],
      },
      {
        title: {
          en: "A2. Water treatment & purification",
          hi: "ए2. जल उपचार एवं शुद्धिकरण",
        },
        questions: [
          {
            qid: "A2.1",
            title: {
              en: "Is there a WTP / Iron Removal Plant / Defluoridation Plant serving the village?",
              hi: "क्या गांव में जल शोधन संयंत्र / लौह निष्कासन संयंत्र / डिफ्लूओरिडेशन संयंत्र है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: { en: "Water treatment plants", hi: "जल उपचार संयंत्र" },
            parentId: null,
          },
          {
            qid: "A2.2",
            title: { en: "Type and functional status", hi: "प्रकार और कार्यशील स्थिति" },
            type: "text",
            uom: { en: "Type; Functional?", hi: "प्रकार; कार्यात्मक?" },
            parentId: "A2.1",
            triggerValue: "Yes",
          },
          {
            qid: "A2.4",
            title: {
              en: "Is there any quality test in the last 3 years?",
              hi: "क्या पिछले 3 वर्षों में कोई गुणवत्ता परीक्षण हुआ है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            parentId: null,
          },
          {
            qid: "A2.5",
            title: { en: "Date of water quality test", hi: "जल गुणवत्ता परीक्षण की तिथि" },
            type: "date",
            uom: { en: "Date", hi: "तिथि" },
            parentId: "A2.4",
            triggerValue: "Yes",
          },
          {
            qid: "A2.6",
            title: {
              en: "Result of quality test",
              hi: "गुणवत्ता परीक्षण का परिणाम",
            },
            type: "options",
            uom: { en: "Drinkable / Not drinkable", hi: "पीने योग्य / नहीं" },
            options: [
              { value: "Drinkable", label: { en: "Drinkable", hi: "पीने योग्य" } },
              { value: "NotDrinkable", label: { en: "Not drinkable", hi: "पीने योग्य नहीं" } },
            ],
            parentId: "A2.4",
            triggerValue: "Yes",
          },
          {
            qid: "A2.7",
            title: {
              en: "Water-borne diseases reported in last 2 years?",
              hi: "पिछले 2 वर्षों में जल जनित रोग रिपोर्ट हुए?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Disease types", hi: "हां/नहीं; रोग के प्रकार" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Disease types reported", hi: "रिपोर्ट किए गए रोग" },
                detail: {
                  mode: "multi",
                  options: [
                    { value: "Diarrhoea", label: { en: "Diarrhoea", hi: "दस्त" } },
                    { value: "Cholera", label: { en: "Cholera", hi: "हैजा" } },
                    { value: "Typhoid", label: { en: "Typhoid", hi: "टाइफाइड" } },
                    { value: "Fluorosis", label: { en: "Fluorosis", hi: "फ्लोरोसिस" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Purification / treatment", hi: "शुद्धिकरण / उपचार" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "A3. Gaps & community feedback",
          hi: "ए3. कमियां एवं समुदाय प्रतिक्रिया",
        },
        questions: [
          {
            qid: "A3.1",
            title: {
              en: "Does the village rely on tankers during summer?",
              hi: "क्या गर्मियों में गांव टैंकरों पर निर्भर रहता है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: { en: "Temporary water distribution", hi: "अस्थायी जल वितरण" },
            parentId: null,
          },
          {
            qid: "A3.2",
            title: { en: "Per Day No. of Tankers during summer", hi: "गर्मियों में दैनिक टैंकरों की संख्या" },
            type: "text",
            uom: { en: "Number of Tankers", hi: "टैंकरों की संख्या" },
            parentId: "A3.1",
            triggerValue: "Yes",
          },
          {
            qid: "A3.4",
            title: {
              en: "Are SC/ST and marginalised households able to access drinking water equally?",
              hi: "क्या अनुसूचित जाति/जनजाति एवं हाशिए के परिवारों को समान पहुंच है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "A4. Drinking water – infrastructure gap matrix",
          hi: "ए4. पेयजल – अवसंरचना अंतराल मैट्रिक्स",
        },
        questions: [
          {
            qid: "A4.1",
            title: { en: "Infrastructure gap matrix", hi: "अवसंरचना अंतराल मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "PipedConnections", label: { en: "Piped water household connections", hi: "घरेलू पाइपयुक्त जल कनेक्शन" } },
              { value: "Handpumps", label: { en: "Handpumps", hi: "हैंडपंप" } },
              { value: "Borewells", label: { en: "Borewells (non-handpump)", hi: "बोरवेल (हैंडपंप रहित)" } },
              { value: "OHTs", label: { en: "Overhead Tanks (OHTs)", hi: "ओवरहेड टैंक (ओएचटी)" } },
              { value: "WTPs", label: { en: "Water Treatment Plants (WTPs)", hi: "जल उपचार संयंत्र (डब्ल्यूटीपी)" } },
              { value: "IRPs", label: { en: "Iron Removal Plants (IRPs)", hi: "लौह निष्कासन संयंत्र (आईआरपी)" } },
              { value: "SolarPumps", label: { en: "Solar pumps (nos.)", hi: "सौर पंप (संख्या)" } },
              { value: "ROUnits", label: { en: "Community RO / Purifier units", hi: "सामुदायिक आरओ / प्यूरीफायर इकाइयाँ" } },
              { value: "Pipeline", label: { en: "Distribution pipeline (km)", hi: "वितरण पाइपलाइन (किमी)" } },
              { value: "SchoolSupply", label: { en: "Water supply to schools/AWCs/PHCs", hi: "स्कूल/एडब्ल्यूसी/पीएचसी को जल आपूर्ति" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "B",
    title: { en: "Environment Preservation & Pollution Control", hi: "पर्यावरण संरक्षण एवं प्रदूषण नियंत्रण" },
    ruleRef: "Rule 22(2)(b) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Effluent treatment plants (ETPs), prevention of pollution in streams/lakes/ponds/groundwater, air and dust pollution control from mining, mine drainage systems, mine pollution prevention technologies, air quality monitoring, pollution control for working/abandoned mines, sustainable mine development measures.",
      hi: "पात्र: ईटीपी, जल स्रोत प्रदूषण रोकथाम, वायु/धूल प्रदूषण नियंत्रण, माइन ड्रेनेज, प्रदूषण रोकथाम प्रौद्योगिकी, वायु गुणवत्ता मॉनिटरिंग, परित्यक्त खदान सुधार।",
    },
    order: [
      {
        title: {
          en: "B1. Pollution status assessment",
          hi: "बी1. प्रदूषण स्थिति आकलन",
        },
        questions: [
          {
            qid: "B1.1",
            title: {
              en: "Are any streams, rivers, nallahs, lakes or ponds in the village visibly affected by mining discharges/runoff?",
              hi: "क्या गांव के जल स्रोत खनन अपशिष्ट/बहाव से प्रभावित हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Water body name", hi: "हां/नहीं; जल स्रोत नाम" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Water body name", hi: "जल स्रोत का नाम" },
                detail: { mode: "text", placeholder: "Enter water body name" },
              },
            ],
            dmfEligible: {
              en: "Prevention of pollution of streams/lakes/ponds",
              hi: "जल स्रोत प्रदूषण रोकथाम",
            },
            parentId: null,
          },
          {
            qid: "B1.2",
            title: {
              en: "Has groundwater quality (bore/well water) deteriorated due to mining activity?",
              hi: "क्या खनन के कारण भूजल गुणवत्ता खराब हुई है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Description", hi: "हां/नहीं; विवरण" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Contaminants observed", hi: "देखे गए प्रदूषक" },
                detail: {
                  mode: "multi",
                  options: [
                    { value: "Colour", label: { en: "Colour", hi: "रंग" } },
                    { value: "Odour", label: { en: "Odour", hi: "गंध" } },
                    { value: "Turbidity", label: { en: "Turbidity", hi: "मैलापन" } },
                    { value: "Chemical", label: { en: "Chemical", hi: "रासायनिक" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Prevention of groundwater pollution", hi: "भूजल प्रदूषण रोकथाम" },
            parentId: null,
          },
          {
            qid: "B1.3",
            title: {
              en: "Is air/dust pollution from mining operations, haul roads, or mine dumps a significant problem in the village?",
              hi: "क्या खनन संचालन/हॉल रोड/डंप से वायु-धूल प्रदूषण गंभीर समस्या है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Severity (Low/Med/High)", hi: "हां/नहीं; गंभीरता" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Severity", hi: "गंभीरता" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "Low", label: { en: "Low", hi: "कम" } },
                    { value: "Medium", label: { en: "Medium", hi: "मध्यम" } },
                    { value: "High", label: { en: "High", hi: "उच्च" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Air & dust pollution control measures", hi: "वायु/धूल प्रदूषण नियंत्रण" },
            parentId: null,
          },
          {
            qid: "B1.4",
            title: {
              en: "Mining-related diseases reported in the community (silicosis, pneumoconiosis, skin, respiratory, eye)?",
              hi: "समुदाय में खनन-सम्बंधित रोग (सिलिकोसिस/श्वसन/त्वचा/नेत्र)?",
            },
            type: "small_matrix",
            uom: { en: "Disease; Cases reported", hi: "रोग; रिपोर्ट किए गए मामले" },
            matrixDefaultValue: "0",
            parentId: null,
            matrixRows: [
              { value: "Silicosis", label: { en: "Silicosis", hi: "सिलिकोसिस" } },
              { value: "Pneumoconiosis", label: { en: "Pneumoconiosis", hi: "न्यूमोकोनिओसिस" } },
              { value: "Respiratory", label: { en: "Respiratory", hi: "श्वसन" } },
              { value: "Skin", label: { en: "Skin", hi: "त्वचा" } },
              { value: "Eye", label: { en: "Eye", hi: "नेत्र" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Disease", hi: "रोग" } },
              {
                value: "cases",
                label: { en: "No. of cases reported", hi: "रिपोर्ट किए गए मामले" },
                inputType: "number",
              },
            ],
          },
          {
            qid: "B1.5",
            title: {
              en: "Are there abandoned/closed mines near the village causing environmental hazards?",
              hi: "क्या गांव के पास परित्यक्त/बंद खदानें पर्यावरणीय खतरा पैदा कर रही हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of mines", hi: "हां/नहीं; खदान संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "No. of mines", hi: "खदानों की संख्या" },
                detail: { mode: "text", placeholder: "Enter count" },
              },
            ],
            dmfEligible: { en: "Measures for abandoned mines", hi: "परित्यक्त खदान उपाय" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "B2. Existing pollution control infrastructure",
          hi: "बी2. विद्यमान प्रदूषण नियंत्रण अवसंरचना",
        },
        questions: [
          {
            qid: "B2.1",
            title: {
              en: "Is there an Effluent Treatment Plant (ETP) for mining wastewater in or near the village?",
              hi: "क्या गांव/आसपास खनन अपशिष्ट जल हेतु ईटीपी उपलब्ध है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Functional?", hi: "हां/नहीं; कार्यशील?" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Functional status", hi: "कार्यशील स्थिति" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "Functional", label: { en: "Functional", hi: "कार्यशील" } },
                    { value: "PartiallyFunctional", label: { en: "Partially functional", hi: "आंशिक कार्यशील" } },
                    { value: "NonFunctional", label: { en: "Non-functional", hi: "अकार्यशील" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Effluent treatment plants", hi: "ईटीपी" },
            parentId: null,
          },
          {
            qid: "B2.2",
            title: {
              en: "Is there a mine drainage system to prevent mine water from contaminating natural water bodies?",
              hi: "क्या प्राकृतिक जल स्रोतों की रक्षा हेतु माइन ड्रेनेज प्रणाली है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Adequate?", hi: "हां/नहीं; पर्याप्त?" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Adequacy", hi: "पर्याप्तता" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "Adequate", label: { en: "Adequate", hi: "पर्याप्त" } },
                    { value: "Inadequate", label: { en: "Inadequate", hi: "अपर्याप्त" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Mine drainage systems", hi: "माइन ड्रेनेज सिस्टम" },
            parentId: null,
          },
          {
            qid: "B2.3",
            title: {
              en: "Are there any air quality monitoring stations / dust suppression systems installed near the mine?",
              hi: "क्या खदान के पास वायु गुणवत्ता मॉनिटरिंग/डस्ट नियंत्रण प्रणाली है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of stations", hi: "हां/नहीं; स्टेशनों की संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "No. of stations", hi: "स्टेशन संख्या" },
                detail: { mode: "text", placeholder: "Enter count" },
              },
            ],
            dmfEligible: { en: "Air quality monitoring & control", hi: "वायु गुणवत्ता मॉनिटरिंग एवं नियंत्रण" },
            parentId: null,
          },
          {
            qid: "B2.4",
            title: {
              en: "Has any environmental impact study / baseline study been conducted for the mining area?",
              hi: "क्या खनन क्षेत्र हेतु पर्यावरण प्रभाव/बेसलाइन अध्ययन हुआ है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Year; Agency", hi: "हां/नहीं; वर्ष; एजेंसी" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Year and agency", hi: "वर्ष एवं एजेंसी" },
                detail: { mode: "text", placeholder: "e.g. 2024, CPCB lab" },
              },
            ],
            parentId: null,
          },
        ],
      },
     
      {
        title: {
          en: "B4. Environment & pollution control – gap matrix",
          hi: "बी4. पर्यावरण एवं प्रदूषण नियंत्रण गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "B4.1",
            title: { en: "Environment gap matrix", hi: "पर्यावरण गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "ETPs", label: { en: "Effluent Treatment Plants (ETPs)", hi: "एफ्लुएंट ट्रीटमेंट प्लांट (ईटीपी)" } },
              { value: "MineDrainage", label: { en: "Mine drainage / interception systems", hi: "माइन ड्रेनेज / इंटरसेप्शन सिस्टम" } },
              { value: "DustSuppression", label: { en: "Dust suppression systems (haul roads/mine)", hi: "डस्ट सप्रेशन सिस्टम (हॉल रोड/माइन)" } },
              { value: "AirMonitoring", label: { en: "Air quality monitoring stations", hi: "वायु गुणवत्ता मॉनिटरिंग स्टेशन" } },
              { value: "AbandonedMine", label: { en: "Abandoned mine reclamation/capping", hi: "परित्यक्त खदान पुनर्वास/कैपिंग" } },
              { value: "Pond", label: { en: "Ponds (nos.)", hi: "पॉन्ड (संख्या)" } },
              { value: "StreamProtection", label: { en: "Stream/nallah pollution prevention works", hi: "नाला/धारा प्रदूषण रोकथाम कार्य" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "C",
    title: { en: "Health Care", hi: "स्वास्थ्य देखभाल" },
    ruleRef: "Rule 22(2)(c) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Primary/secondary health facilities in mining-affected areas, staffing (doctors/paramedical/support staff), equipment & supplies, mobile health care units, group health insurance for mining-affected persons. Focus on mining-related illnesses. Converge with existing health infra of local bodies, State & Central govt.",
      hi: "पात्र: खनन-प्रभावित क्षेत्रों में प्राथमिक/द्वितीयक स्वास्थ्य सुविधाएं, स्टाफिंग (डॉक्टर/पैरामेडिकल/सहायक), उपकरण एवं आपूर्ति, मोबाइल स्वास्थ्य इकाइयां, खनन-प्रभावित व्यक्तियों हेतु समूह स्वास्थ्य बीमा। खनन-संबंधी रोगों पर केंद्रित। स्थानीय निकायों, राज्य एवं केंद्र की मौजूदा स्वास्थ्य अवसंरचना के साथ अभिसरण।",
    },
    order: [
      {
        title: {
          en: "C1. Existing health infrastructure",
          hi: "सी1. विद्यमान स्वास्थ्य अवसंरचना",
        },
        questions: [
          {
            qid: "C1.1",
            title: {
              en: "Health facilities available in the village",
              hi: "गांव में उपलब्ध स्वास्थ्य सुविधाएं",
            },
            type: "facility_group",
            uom: { en: "Yes/No; Distance (km) if No", hi: "हां/नहीं; दूरी (किमी) यदि नहीं" },
            facilities: [
              { key: "SHC", label: { en: "Sub-Health Centre (SHC)", hi: "उप-स्वास्थ्य केंद्र (SHC)" } },
              { key: "PHC", label: { en: "Primary Health Centre (PHC)", hi: "प्राथमिक स्वास्थ्य केंद्र (PHC)" } },
              { key: "CHC", label: { en: "Community Health Centre (CHC)", hi: "सामुदायिक स्वास्थ्य केंद्र (CHC)" } },
            ],
            parentId: null,
          },
          {
            qid: "C1.4",
            title: {
              en: "Is there a mobile health unit or periodic medical camp in the village?",
              hi: "क्या गांव में मोबाइल स्वास्थ्य इकाई या आवधिक चिकित्सा शिविर है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Frequency", hi: "हां/नहीं; आवृत्ति" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Frequency", hi: "आवृत्ति" },
                detail: { mode: "text", placeholder: "Monthly/quarterly etc." },
              },
            ],
            dmfEligible: { en: "Mobile health care units", hi: "मोबाइल स्वास्थ्य इकाइयां" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "C2. Health burden & mining impact",
          hi: "सी2. स्वास्थ्य भार एवं खनन प्रभाव",
        },
        questions: [
          {
            qid: "C2.1",
            title: {
              en: "Prevalence of mining-related diseases (approx. no. of cases)",
              hi: "खनन-संबंधी रोगों का प्रसार (अनुमानित मामले)",
            },
            type: "small_matrix",
            uom: { en: "Disease; Cases", hi: "रोग; मामले" },
            dmfEligible: { en: "Mining-disease focused health infra", hi: "खनन-रोग केंद्रित स्वास्थ्य अवसंरचना" },
            parentId: null,
            matrixRows: [
              { value: "Silicosis", label: { en: "Silicosis", hi: "सिलिकोसिस" } },
              { value: "Pneumoconiosis", label: { en: "Pneumoconiosis", hi: "न्यूमोकोनिओसिस" } },
              { value: "TB", label: { en: "TB", hi: "टीबी" } },
              { value: "Respiratory", label: { en: "Respiratory disorders", hi: "श्वसन विकार" } },
              { value: "Skin", label: { en: "Skin disorders", hi: "त्वचा विकार" } },
              { value: "Eye", label: { en: "Eye disorders", hi: "नेत्र विकार" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "cases", label: { en: "Cases", hi: "मामले" }, inputType: "number" },
            ],
          },
          {
            qid: "C2.2",
            title: {
              en: "Maternal mortality / infant mortality / malnutrition status in the village (if data available)",
              hi: "गांव में मातृ मृत्यु / शिशु मृत्यु / कुपोषण स्थिति (यदि डेटा उपलब्ध हो)",
            },
            type: "small_matrix",
            uom: { en: "Indicator; Stats", hi: "सूचक; आंकड़े" },
            parentId: null,
            matrixRows: [
              { value: "MaternalMortality", label: { en: "Maternal mortality", hi: "मातृ मृत्यु" } },
              { value: "InfantMortality", label: { en: "Infant mortality", hi: "शिशु मृत्यु" } },
              { value: "Malnutrition", label: { en: "Malnutrition status", hi: "कुपोषण स्थिति" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "stats", label: { en: "Stats", hi: "आंकड़े" }, inputType: "text" },
            ],
          },
          {
            qid: "C2.3",
            title: {
              en: "Are mining-affected persons covered under any group health insurance scheme?",
              hi: "क्या खनन-प्रभावित व्यक्ति किसी समूह स्वास्थ्य बीमा योजना में आवृत हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Scheme name", hi: "हां/नहीं; योजना नाम" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Scheme name", hi: "योजना का नाम" },
                detail: { mode: "dropdown", options: formSchemeOptions.C },
              },
            ],
            dmfEligible: { en: "Group Insurance Scheme", hi: "समूह बीमा योजना" },
            parentId: null,
          },
          {
            qid: "C2.4",
            title: {
              en: "Average travel time to access health services from the village (for emergency)",
              hi: "गांव से स्वास्थ्य सेवाओं तक पहुंचने हेतु औसत यात्रा समय (आपातकाल हेतु)",
            },
            type: "duration",
            uom: { en: "Duration (hrs:min)", hi: "अवधि (घंटे:मिनट)" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "C4. Health care – gap matrix",
          hi: "सी4. स्वास्थ्य देखभाल गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "C4.1",
            title: { en: "Health care gap matrix", hi: "स्वास्थ्य देखभाल गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "SubHealthCentre", label: { en: "Sub-Health Centre / PHC building", hi: "उप-स्वास्थ्य केंद्र / पीएचसी भवन" } },
              { value: "MedicalEquipment", label: { en: "Medical equipment (diagnostics, OT)", hi: "चिकित्सा उपकरण (डायग्नोस्टिक्स, OT)" } },
              { value: "DoctorPosts", label: { en: "Doctor / specialist posts (vacant)", hi: "डॉक्टर / विशेषज्ञ पद (रिक्त)" } },
              { value: "ParamedicalPosts", label: { en: "Paramedical / ANM staff posts (vacant)", hi: "पैरामेडिकल / ANM स्टाफ पद (रिक्त)" } },
              { value: "MobileHealthUnit", label: { en: "Mobile health unit / medical van", hi: "मोबाइल स्वास्थ्य इकाई / मेडिकल वैन" } },
              { value: "Ambulance", label: { en: "Ambulance service", hi: "एम्बुलेंस सेवा" } },
              { value: "GroupInsurance", label: { en: "Group health insurance scheme", hi: "समूह स्वास्थ्य बीमा योजना" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
            { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
         
            { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
            { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
            {
              value: "Scheme Name",
              label: { en: "Scheme Name", hi: "योजना का नाम" },
              inputType: "dropdown",
              dropdownOptions: formSchemeOptions.A,
            },
          ],
          },
        ],
      },
    ],
  },
  {
    code: "D",
    title: { en: "Education", hi: "शिक्षा" },
    ruleRef: "Rule 22(2)(d) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: School/college/vocational training buildings, additional classrooms, labs, libraries, art & craft rooms, toilet blocks, drinking water, residential schools/hostels, sports infra, teacher/staff engagement, e-learning setup, transport (bus/van/cycle/rickshaw), nutrition programs, financial support for higher education for students of affected areas.",
      hi: "पात्र: विद्यालय/महाविद्यालय/व्यावसायिक प्रशिक्षण भवन, अतिरिक्त कक्षाएं, प्रयोगशालाएं, पुस्तकालय, कला-शिल्प कक्ष, शौचालय, पेयजल, आवासीय विद्यालय/छात्रावास, खेल अवसंरचना, शिक्षक/स्टाफ नियोजन, ई-लर्निंग, परिवहन, पोषण कार्यक्रम, उच्च शिक्षा हेतु वित्तीय सहायता।",
    },
    order: [
      {
        title: {
          en: "D1. School infrastructure",
          hi: "डी1. विद्यालय अवसंरचना",
        },
        questions: [
          {
            qid: "D1.1",
            title: {
              en: "Schools available in the village",
              hi: "गांव में उपलब्ध विद्यालय",
            },
            type: "tiered_access",
            uom: { en: "Yes/No; Management if Yes; Distance (km) if No", hi: "हां/नहीं; हां होने पर प्रबंधन; नहीं होने पर दूरी (किमी)" },
            facilities: [
              { key: "PrimarySchool", label: { en: "Primary School", hi: "प्राथमिक विद्यालय" } },
              { key: "UpperPrimarySchool", label: { en: "Upper Primary School", hi: "उच्च प्राथमिक विद्यालय" } },
              { key: "HighSchool", label: { en: "High School", hi: "हाई स्कूल" } },
              { key: "HigherSecondarySchool", label: { en: "Higher Secondary School", hi: "हायर सेकेंडरी स्कूल" } },
            ],
            managementOptions: [
              { value: "Govt", label: { en: "Govt.", hi: "सरकारी" } },
              { value: "Aided", label: { en: "Aided", hi: "अनुदानित" } },
              { value: "Private", label: { en: "Private", hi: "निजी" } },
            ],
            parentId: null,
          },
          {
            qid: "D1.2",
            title: {
              en: "No. of classrooms required vs. available (shortage / excess)",
              hi: "आवश्यक बनाम उपलब्ध कक्षाओं की संख्या (कमी / अधिकता)",
            },
            type: "text",
            uom: { en: "Required; Available; Gap", hi: "आवश्यक; उपलब्ध; कमी" },
            dmfEligible: { en: "Additional classrooms", hi: "अतिरिक्त कक्षाएं" },
            parentId: null,
          },
          {
            qid: "D1.3",
            title: {
              en: "Are science labs, computer labs, libraries, art & craft rooms available and functional in schools?",
              hi: "क्या विद्यालयों में विज्ञान प्रयोगशाला, कंप्यूटर लैब, पुस्तकालय, कला-शिल्प कक्ष उपलब्ध एवं कार्यशील हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No per facility", hi: "प्रत्येक सुविधा हेतु हां/नहीं" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Missing facilities", hi: "अनुपलब्ध सुविधाएं" },
                detail: { mode: "text", placeholder: "List missing labs/library/rooms" },
              },
            ],
            dmfEligible: { en: "Labs, libraries, art/craft rooms", hi: "प्रयोगशालाएं, पुस्तकालय, कला-शिल्प कक्ष" },
            parentId: null,
          },
          {
            qid: "D1.4",
            title: {
              en: "Are functional toilets (separate for girls) available in all schools?",
              hi: "क्या सभी विद्यालयों में कार्यशील शौचालय (बालिकाओं हेतु पृथक) उपलब्ध हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of toilets needed", hi: "हां/नहीं; आवश्यक शौचालय संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "No. of toilets needed", hi: "आवश्यक शौचालय संख्या" },
                detail: { mode: "text", placeholder: "Enter count needed" },
              },
            ],
            dmfEligible: { en: "Toilet blocks in schools", hi: "विद्यालयों में शौचालय" },
            parentId: null,
          },
          {
            qid: "D1.5",
            title: {
              en: "Is drinking water available in all schools? Source and quality?",
              hi: "क्या सभी विद्यालयों में पेयजल उपलब्ध है? स्रोत और गुणवत्ता?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Source; Quality", hi: "हां/नहीं; स्रोत; गुणवत्ता" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Source and quality", hi: "स्रोत और गुणवत्ता" },
                detail: { mode: "text", placeholder: "Handpump/tap/potable etc." },
              },
            ],
            dmfEligible: { en: "Drinking water provision in schools", hi: "विद्यालयों में पेयजल प्रावधान" },
            parentId: null,
          },
          {
            qid: "D1.6",
            title: {
              en: "Is there a residential school / hostel for students from the affected area?",
              hi: "क्या प्रभावित क्षेत्र के छात्रों हेतु आवासीय विद्यालय / छात्रावास है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Capacity; Need", hi: "हां/नहीं; क्षमता; आवश्यकता" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Capacity and need", hi: "क्षमता और आवश्यकता" },
                detail: { mode: "text", placeholder: "Current capacity / additional needed" },
              },
            ],
            dmfEligible: { en: "Residential schools / hostels", hi: "आवासीय विद्यालय / छात्रावास" },
            parentId: null,
          },
          {
            qid: "D1.7",
            title: {
              en: "Sports infrastructure available in schools (playground, equipment)?",
              hi: "क्या विद्यालयों में खेल अवसंरचना (खेल मैदान, उपकरण) उपलब्ध है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Condition", hi: "हां/नहीं; स्थिति" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Condition", hi: "स्थिति" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "Good", label: { en: "Good", hi: "अच्छी" } },
                    { value: "Average", label: { en: "Average", hi: "सामान्य" } },
                    { value: "Poor", label: { en: "Poor", hi: "खराब" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Sports infrastructure", hi: "खेल अवसंरचना" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "D2. Teachers & support",
          hi: "डी2. शिक्षक एवं सहायता",
        },
        questions: [
          {
            qid: "D2.1",
            title: {
              en: "Are all sanctioned teacher posts filled in govt. schools?",
              hi: "क्या सरकारी विद्यालयों में सभी स्वीकृत शिक्षक पद भरे गए हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Vacant posts", hi: "हां/नहीं; रिक्त पद" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Vacant posts required", hi: "आवश्यक रिक्त पद" },
                detail: { mode: "number", placeholder: "Enter number of vacant posts" },
              },
            ],
            dmfEligible: { en: "Engagement of teachers / support staff", hi: "शिक्षक / सहायक स्टाफ नियोजन" },
            parentId: null,
          },
          {
            qid: "D2.2",
            title: {
              en: "Is e-learning / digital classroom setup available in schools?",
              hi: "क्या विद्यालयों में ई-लर्निंग / डिजिटल कक्षा उपलब्ध है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: { en: "E-learning setup", hi: "ई-लर्निंग सेटअप" },
            parentId: null,
          },
          {
            qid: "D2.3",
            title: {
              en: "Is there a need for student transport facility for remote habitations?",
              hi: "क्या दूरस्थ बस्तियों हेतु छात्र परिवहन सुविधा की आवश्यकता है?",
            },
            type: "options",
            uom: { en: "Yes / No", hi: "हां / नहीं" },
            options: yesNo,
            dmfEligible: { en: "Transport arrangement", hi: "परिवहन व्यवस्था" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "D3. Higher education & vocational training",
          hi: "डी3. उच्च शिक्षा एवं व्यावसायिक प्रशिक्षण",
        },
        questions: [
          {
            qid: "D3.1",
            title: {
              en: "Is there a college / ITI / vocational training institute within 20 km?",
              hi: "क्या 20 किमी के भीतर महाविद्यालय / आईटीआई / व्यावसायिक प्रशिक्षण संस्थान है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance if No", hi: "हां/नहीं; दूरी यदि नहीं" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" },
                detail: { mode: "number", placeholder: "Enter distance in km" },
              },
            ],
            dmfEligible: { en: "Vocational training institute", hi: "व्यावसायिक प्रशिक्षण संस्थान" },
            parentId: null,
          },
          {
            qid: "D3.2",
            title: {
              en: "No. of students from mining-affected area enrolled in government-aided higher education institutions",
              hi: "खनन-प्रभावित क्षेत्र से सरकारी-अनुदानित उच्च शिक्षा संस्थानों में नामांकित छात्र संख्या",
            },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            dmfEligible: { en: "Financial support for higher education", hi: "उच्च शिक्षा हेतु वित्तीय सहायता" },
            parentId: null,
          },
          {
            qid: "D3.3",
            title: {
              en: "Do eligible students receive scholarships / financial assistance under any DMFT or State scheme?",
              hi: "क्या पात्र छात्रों को किसी डीएमएफटी या राज्य योजना के तहत छात्रवृत्ति / वित्तीय सहायता मिलती है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Amount (Rs.)", hi: "हां/नहीं; राशि (रुपये)" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Scheme and amount", hi: "योजना और राशि" },
                detail: { mode: "text", placeholder: "Scheme name and per-student amount" },
              },
            ],
            dmfEligible: { en: "Financial support — higher education", hi: "वित्तीय सहायता — उच्च शिक्षा" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "D4. Nutrition",
          hi: "डी4. पोषण",
        },
        questions: [
          {
            qid: "D4.1",
            title: {
              en: "Is Mid-Day Meal (MDM) / PM POSHAN scheme functional in all schools?",
              hi: "क्या मध्याह्न भोजन (MDM) / पीएम पोषण योजना सभी विद्यालयों में कार्यशील है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Scheme or Coverage gap", hi: "हां/नहीं; योजना या कवरेज कमी" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Scheme", hi: "योजना" },
                detail: {
                  mode: "dropdown",
                  options: [
                    { value: "MDM", label: { en: "Mid-Day Meal (MDM)", hi: "मध्याह्न भोजन (MDM)" } },
                    { value: "PMPOSHAN", label: { en: "PM POSHAN", hi: "पीएम पोषण" } },
                    { value: "BOTH", label: { en: "Both MDM & PM POSHAN", hi: "MDM एवं पीएम पोषण दोनों" } },
                  ],
                },
              },
              {
                triggerValue: "No",
                detailLabel: { en: "Coverage gap", hi: "कवरेज कमी" },
                detail: { mode: "text", placeholder: "Which schools are not covered" },
              },
            ],
            dmfEligible: { en: "Nutrition-related programs", hi: "पोषण-संबंधी कार्यक्रम" },
            parentId: null,
          },
          {
            qid: "D4.2",
            title: {
              en: "Prevalence of child malnutrition / stunting / wasting in the village (ICDS data)?",
              hi: "गांव में बाल कुपोषण / स्टंटिंग / वेस्टिंग का प्रसार (ICDS डेटा)?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Scheme", hi: "हां/नहीं; योजना" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Scheme name", hi: "योजना का नाम" },
                detail: { mode: "dropdown", options: formSchemeOptions.D },
              },
            ],
            dmfEligible: { en: "Nutrition-related programs", hi: "पोषण-संबंधी कार्यक्रम" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "D5. Education – gap matrix",
          hi: "डी5. शिक्षा गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "D5.1",
            title: { en: "Education gap matrix", hi: "शिक्षा गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "AdditionalClassrooms", label: { en: "Additional classrooms (no. required)", hi: "अतिरिक्त कक्षाएं (आवश्यक संख्या)" } },
              { value: "ScienceComputerLabs", label: { en: "Science / computer labs", hi: "विज्ञान / कंप्यूटर प्रयोगशालाएं" } },
              { value: "Libraries", label: { en: "Libraries", hi: "पुस्तकालय" } },
              { value: "ToiletBlocks", label: { en: "Toilet blocks (girls / boys)", hi: "शौचालय (बालिका / बालक)" } },
              { value: "DrinkingWaterSchools", label: { en: "Drinking water in schools", hi: "विद्यालयों में पेयजल" } },
              { value: "ResidentialHostel", label: { en: "Residential school / hostel", hi: "आवासीय विद्यालय / छात्रावास" } },
              { value: "Elearning", label: { en: "E-learning / digital classroom", hi: "ई-लर्निंग / डिजिटल कक्षा" } },
              { value: "StudentTransport", label: { en: "Student transport (bus/van/cycle)", hi: "छात्र परिवहन (बस/वैन/साइकिल)" } },
              { value: "SportsInfra", label: { en: "Sports infrastructure", hi: "खेल अवसंरचना" } },
              { value: "HigherEdSupport", label: { en: "Higher education financial support", hi: "उच्च शिक्षा वित्तीय सहायता" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "E",
    title: { en: "Welfare of Women & Children", hi: "महिला एवं बाल कल्याण" },
    ruleRef: "Rule 22(2)(e) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Special programmes for maternal & child health, malnutrition, infectious diseases, and other welfare needs of women and children in mining-affected areas.",
      hi: "पात्र: खनन-प्रभावित क्षेत्रों में महिलाओं एवं बच्चों की मातृ एवं शिशु स्वास्थ्य, कुपोषण, संक्रामक रोग एवं अन्य कल्याण आवश्यकताओं हेतु विशेष कार्यक्रम।",
    },
    order: [
      {
        title: {
          en: "E1. Maternal & child health",
          hi: "ई1. मातृ एवं शिशु स्वास्थ्य",
        },
        questions: [
          {
            qid: "E1.3",
            title: {
              en: "Maternal mortality / anaemia prevalence / low birth weight rate in the village (approx.)?",
              hi: "गांव में मातृ मृत्यु / एनीमिया प्रसार / कम जन्म भार दर (अनुमानित)?",
            },
            type: "facility_inputs",
            uom: { en: "Rate / value by indicator", hi: "सूचकानुसार दर / मान" },
            facilityInputType: "text",
            facilities: [
              { key: "MaternalMortality", label: { en: "Maternal mortality", hi: "मातृ मृत्यु" } },
              { key: "Anaemia", label: { en: "Anaemia prevalence", hi: "एनीमिया प्रसार" } },
              { key: "LowBirthWeight", label: { en: "Low birth weight rate", hi: "कम जन्म भार दर" } },
            ],
            dmfEligible: { en: "Maternal health programmes", hi: "मातृ स्वास्थ्य कार्यक्रम" },
            parentId: null,
          },
          {
            qid: "E1.4",
            title: {
              en: "No. of severely acute malnourished (SAM) / moderately acute malnourished (MAM) children?",
              hi: "अति गंभीर कुपोषित (SAM) / मध्यम तीव्र कुपोषित (MAM) बच्चों की संख्या?",
            },
            type: "facility_inputs",
            uom: { en: "SAM no.; MAM no.", hi: "SAM संख्या; MAM संख्या" },
            facilityInputType: "number",
            facilities: [
              { key: "SAM", label: { en: "SAM (no.)", hi: "SAM (संख्या)" } },
              { key: "MAM", label: { en: "MAM (no.)", hi: "MAM (संख्या)" } },
            ],
            dmfEligible: { en: "Malnutrition programmes", hi: "कुपोषण कार्यक्रम" },
            parentId: null,
          },
          {
            qid: "E1.5",
            title: {
              en: "Full immunisation coverage rate for children (0–5 years)?",
              hi: "बच्चों (0–5 वर्ष) का पूर्ण टीकाकरण कवरेज दर?",
            },
            type: "number",
            uom: { en: "% covered", hi: "% आवृत" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "E2. Women's welfare",
          hi: "ई2. महिला कल्याण",
        },
        questions: [
          {
            qid: "E2.2",
            title: {
              en: "Are women mining-affected workers or family members covered under any special health/welfare scheme?",
              hi: "क्या खनन-प्रभावित महिला कामगार या परिवार के सदस्य किसी विशेष स्वास्थ्य/कल्याण योजना में आवृत हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Scheme", hi: "हां/नहीं; योजना" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Scheme name", hi: "योजना का नाम" },
                detail: { mode: "dropdown", options: formSchemeOptions.E },
              },
            ],
            dmfEligible: { en: "Special programmes — mining-affected women", hi: "विशेष कार्यक्रम — खनन-प्रभावित महिलाएं" },
            parentId: null,
          },
          {
            qid: "E2.3",
            title: {
              en: "Reported cases of gender-based issues, trafficking, or child labour associated with mining in the area?",
              hi: "क्षेत्र में खनन से जुड़े लैंगिक मुद्दों, तस्करी या बाल श्रम के दर्ज मामले?",
            },
            type: "facility_inputs",
            uom: { en: "Cases (approx.) by type", hi: "प्रकारानुसार मामले (अनुमानित)" },
            facilityInputType: "number",
            facilities: [
              { key: "GenderBased", label: { en: "Gender-based issues", hi: "लैंगिक मुद्दे" } },
              { key: "Trafficking", label: { en: "Trafficking", hi: "तस्करी" } },
              { key: "ChildLabour", label: { en: "Child labour", hi: "बाल श्रम" } },
            ],
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "E3. Infectious disease burden",
          hi: "ई3. संक्रामक रोग भार",
        },
        questions: [
          {
            qid: "E3.1",
            title: {
              en: "Prevalence of malaria / dengue / TB / sickle cell / other vector-borne diseases?",
              hi: "मलेरिया / डेंगू / टीबी / सिकल सेल / अन्य वाहक-जनित रोगों का प्रसार?",
            },
            type: "facility_inputs",
            uom: { en: "Cases/year by disease", hi: "रोगानुसार मामले/वर्ष" },
            facilityInputType: "number",
            facilities: [
              { key: "Malaria", label: { en: "Malaria", hi: "मलेरिया" } },
              { key: "Dengue", label: { en: "Dengue", hi: "डेंगू" } },
              { key: "TB", label: { en: "TB", hi: "टीबी" } },
              { key: "SickleCell", label: { en: "Sickle cell", hi: "सिकल सेल" } },
              { key: "OtherVector", label: { en: "Other vector-borne", hi: "अन्य वाहक-जनित" } },
            ],
            dmfEligible: { en: "Infectious disease programmes", hi: "संक्रामक रोग कार्यक्रम" },
            parentId: null,
          },
          {
            qid: "E3.2",
            title: {
              en: "Is IEC / awareness material on women & child health available in local language?",
              hi: "क्या महिला एवं शिशु स्वास्थ्य पर IEC / जागरूकता सामग्री स्थानीय भाषा में उपलब्ध है?",
            },
            type: "options",
            uom: { en: "Yes/No", hi: "हां/नहीं" },
            options: yesNo,
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "E4. Women & children welfare – gap matrix",
          hi: "ई4. महिला एवं बाल कल्याण – अंतराल मैट्रिक्स",
        },
        questions: [
          {
            qid: "E4.1",
            title: { en: "Women & children welfare gap matrix", hi: "महिला एवं बाल कल्याण अंतराल मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "AnganwadiCentre", label: { en: "Anganwadi Centre (AWC)", hi: "आंगनबाड़ी केंद्र (AWC)" } },
              { value: "WeighingScale", label: { en: "Weighing scale", hi: "तौलने का तराजू" } },
              { value: "NutritionSupplements", label: { en: "Nutrition supplements", hi: "पोषण पूरक" } },
              { value: "IECMaterials", label: { en: "IEC materials", hi: "IEC सामग्री" } },
              { value: "SHGsForWomen", label: { en: "Self Help Groups (SHGs) for women", hi: "महिलाओं के लिए स्वयं सहायता समूह (SHG)" } },
              { value: "WelfarePrograms", label: { en: "Welfare programmes", hi: "कल्याण कार्यक्रम" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.E,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "F",
    title: { en: "Welfare of Aged & Differently Abled", hi: "वृद्ध एवं दिव्यांग कल्याण" },
    ruleRef: "Rule 22(2)(f) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Special programs and medical support for aged and differently abled persons, financial assistance to District Disability Rehabilitation Centres (DDRCs).",
      hi: "पात्र: वृद्ध एवं दिव्यांग व्यक्तियों हेतु विशेष कार्यक्रम एवं चिकित्सा सहायता, जिला दिव्यांग पुनर्वास केंद्रों (DDRCs) को वित्तीय सहायता।",
    },
    order: [
      {
        title: {
          en: "F1. Elderly population",
          hi: "एफ1. वृद्ध जनसंख्या",
        },
        questions: [
          {
            qid: "F1.1",
            title: {
              en: "No. of elderly persons (60+ years) in the village, especially those dependent/destitute",
              hi: "गांव में वृद्ध व्यक्तियों (60+ वर्ष) की संख्या, विशेषतः आश्रित/निराश्रित",
            },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            dmfEligible: { en: "Special welfare programmes", hi: "विशेष कल्याण कार्यक्रम" },
            parentId: null,
          },
          {
            qid: "F1.2",
            title: {
              en: "Are elderly persons covered under old age pension / Indira Gandhi National Old Age Pension Scheme?",
              hi: "क्या वृद्ध व्यक्ति वृद्धावस्था पेंशन / इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना में आवृत हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Scheme coverage", hi: "हां/नहीं; योजना कवरेज" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Pension scheme coverage", hi: "पेंशन योजना कवरेज" },
                detail: {
                  mode: "small_matrix",
                  matrixDefaultValue: "0",
                  matrixRows: [
                    { value: "OldAgePension", label: { en: "Old age pension", hi: "वृद्धावस्था पेंशन" } },
                    {
                      value: "IGNOAPS",
                      label: {
                        en: "Indira Gandhi National Old Age Pension Scheme",
                        hi: "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना",
                      },
                    },
                  ],
                  matrixCols: [
                    { value: "type", label: { en: "Scheme", hi: "योजना" } },
                    {
                      value: "coverage",
                      label: { en: "Coverage %", hi: "कवरेज %" },
                      inputType: "number",
                    },
                  ],
                },
              },
            ],
            parentId: null,
          },
          {
            qid: "F1.3",
            title: {
              en: "Is geriatric care / medical support accessible for the elderly in the village?",
              hi: "क्या गांव में वृद्धों हेतु जराचिकित्सा / चिकित्सा सहायता सुलभ है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance to facility", hi: "हां/नहीं; सुविधा तक दूरी" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Distance to facility (km)", hi: "सुविधा तक दूरी (किमी)" },
                detail: { mode: "number", placeholder: "Enter distance in km" },
              },
            ],
            dmfEligible: { en: "Medical support — aged", hi: "चिकित्सा सहायता — वृद्ध" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "F2. Differently abled persons",
          hi: "एफ2. दिव्यांग व्यक्ति",
        },
        questions: [
          {
            qid: "F2.1",
            title: {
              en: "No. of differently abled persons (by disability type: locomotor / visual / hearing / intellectual / multiple)",
              hi: "दिव्यांग व्यक्तियों की संख्या (दिव्यांगता प्रकार: गतिज / दृष्टि / श्रवण / बौद्धिक / बहु)",
            },
            type: "small_matrix",
            uom: { en: "No. by type", hi: "प्रकारानुसार संख्या" },
            matrixDefaultValue: "0",
            dmfEligible: { en: "Special programmes — differently abled", hi: "विशेष कार्यक्रम — दिव्यांग" },
            parentId: null,
            matrixRows: [
              { value: "Locomotor", label: { en: "Locomotor", hi: "गतिज" } },
              { value: "Visual", label: { en: "Visual", hi: "दृष्टि" } },
              { value: "Hearing", label: { en: "Hearing", hi: "श्रवण" } },
              { value: "Intellectual", label: { en: "Intellectual", hi: "बौद्धिक" } },
              { value: "Multiple", label: { en: "Multiple", hi: "बहु" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "count", label: { en: "No.", hi: "संख्या" }, inputType: "number" },
            ],
          },
          {
            qid: "F2.2",
            title: {
              en: "Are differently abled persons covered under UDID card / disability pension / any State scheme?",
              hi: "क्या दिव्यांग व्यक्ति UDID कार्ड / दिव्यांगता पेंशन / किसी राज्य योजना में आवृत हैं?",
            },
            type: "small_matrix",
            uom: { en: "Scheme; No. covered", hi: "योजना; आवृत संख्या" },
            matrixDefaultValue: "0",
            matrixRows: [
              { value: "UDID", label: { en: "UDID card", hi: "UDID कार्ड" } },
              { value: "DisabilityPension", label: { en: "Disability pension", hi: "दिव्यांगता पेंशन" } },
              { value: "StateScheme", label: { en: "State scheme", hi: "राज्य योजना" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Scheme", hi: "योजना" } },
              { value: "count", label: { en: "No. covered", hi: "आवृत संख्या" }, inputType: "number" },
            ],
            parentId: null,
          },
          {
            qid: "F2.3",
            title: {
              en: "Access to District Disability Rehabilitation Centre (DDRC) – distance and frequency of services",
              hi: "जिला दिव्यांग पुनर्वास केंद्र (DDRC) तक पहुंच – दूरी और सेवाओं की आवृत्ति",
            },
            type: "dropdown",
            uom: { en: "Frequency", hi: "आवृत्ति" },
            dropdownOptions: [
              { value: "Monthly", label: { en: "Monthly", hi: "मासिक" } },
              { value: "Quarterly", label: { en: "Quarterly", hi: "त्रैमासिक" } },
              { value: "Yearly", label: { en: "Yearly", hi: "वार्षिक" } },
            ],
            dmfEligible: { en: "Financial assistance to DDRCs", hi: "DDRCs को वित्तीय सहायता" },
            parentId: null,
          },
          {
            qid: "F2.4",
            title: {
              en: "Mining-caused disabilities recorded (accident / dust exposure / chemical exposure)?",
              hi: "खनन-जनित दिव्यांगता दर्ज (दुर्घटना / धूल संपर्क / रासायनिक संपर्क)?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Type; No. of cases", hi: "हां/नहीं; प्रकार; मामलों की संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Type-wise no. of cases", hi: "प्रकारानुसार मामलों की संख्या" },
                detail: {
                  mode: "small_matrix",
                  matrixDefaultValue: "0",
                  matrixRows: [
                    { value: "Accident", label: { en: "Accident", hi: "दुर्घटना" } },
                    { value: "DustExposure", label: { en: "Dust Exposure", hi: "धूल संपर्क" } },
                    { value: "ChemicalExposure", label: { en: "Chemical Exposure", hi: "रासायनिक संपर्क" } },
                  ],
                  matrixCols: [
                    { value: "type", label: { en: "Type", hi: "प्रकार" } },
                    { value: "count", label: { en: "No. of cases", hi: "मामलों की संख्या" }, inputType: "number" },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Special medical support", hi: "विशेष चिकित्सा सहायता" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "F3. Welfare gap matrix",
          hi: "एफ3. कल्याण गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "F3.1",
            title: {
              en: "Aged and differently abled welfare gap matrix",
              hi: "वृद्ध एवं दिव्यांग कल्याण गैप मैट्रिक्स",
            },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            dmfEligible: { en: "Special welfare and medical support", hi: "विशेष कल्याण एवं चिकित्सा सहायता" },
            parentId: null,
            matrixRows: [
              { value: "Wheelchairs", label: { en: "Wheelchairs", hi: "व्हीलचेयर" } },
              { value: "HearingAids", label: { en: "Hearing aids", hi: "श्रवण यंत्र" } },
              { value: "WalkingAids", label: { en: "Walking aids / crutches", hi: "चलने के सहायक उपकरण / बैसाखी" } },
              { value: "GeriatricCareSupport", label: { en: "Geriatric care support", hi: "जराचिकित्सा सहायता" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.F,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "G",
    title: { en: "Skill Development & Livelihood Generation", hi: "कौशल विकास एवं आजीविका सृजन" },
    ruleRef: "Rule 22(2)(g) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Skill development for livelihood support & income generation; training, training kits, skill development centres, incubation centres, self-employment schemes; support to SHGs; forward & backward linkages for self-employment; arts & crafts improvement; minor forest produce collection & processing.",
      hi: "पात्र: आजीविका सहायता एवं आय सृजन हेतु कौशल विकास; प्रशिक्षण, प्रशिक्षण किट, कौशल विकास केंद्र, इन्क्यूबेशन केंद्र, स्वरोजगार योजनाएं; SHG सहायता; स्वरोजगार हेतु अग्र एवं पश्च संपर्क; कला-शिल्प सुधार; लघु वन उपज संग्रह एवं प्रसंस्करण।",
    },
    order: [
      {
        title: {
          en: "G1. Existing livelihood & skill infrastructure",
          hi: "जी1. विद्यमान आजीविका एवं कौशल अवसंरचना",
        },
        questions: [
          {
            qid: "G1.1",
            title: {
              en: "Is there a skill development centre / ITI / Pradhan Mantri Kaushal Kendra (PMKK) within 20 km?",
              hi: "क्या 20 किमी के भीतर कौशल विकास केंद्र / आईटीआई / प्रधानमंत्री कौशल केंद्र (PMKK) है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance (km) if No", hi: "हां/नहीं; दूरी (किमी) यदि नहीं" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" },
                detail: { mode: "number", placeholder: "Enter distance in km" },
              },
            ],
            dmfEligible: { en: "Skill development centre", hi: "कौशल विकास केंद्र" },
            parentId: null,
          },
          {
            qid: "G1.2",
            title: {
              en: "Youth (18–35 years) — unemployed and seeking skill training in the village",
              hi: "युवा (18–35 वर्ष) — गांव में बेरोजगार और कौशल प्रशिक्षण खोज रहे",
            },
            type: "facility_inputs",
            uom: { en: "Number by category", hi: "श्रेणी अनुसार संख्या" },
            facilityInputType: "number",
            facilities: [
              { key: "Unemployed", label: { en: "Unemployed (no.)", hi: "बेरोजगार (संख्या)" } },
              { key: "SeekingTraining", label: { en: "Seeking skill training (no.)", hi: "कौशल प्रशिक्षण खोज रहे (संख्या)" } },
            ],
            dmfEligible: { en: "Skill development for livelihood", hi: "आजीविका हेतु कौशल विकास" },
            parentId: null,
          },
          {
            qid: "G1.3",
            title: {
              en: "No. of active SHGs – total members, and sectors of activity (agriculture / handicraft / forest produce / other)",
              hi: "सक्रिय SHG की संख्या – कुल सदस्य और गतिविधि क्षेत्र (कृषि / हस्तशिल्प / वन उपज / अन्य)",
            },
            type: "small_matrix",
            uom: { en: "% by sector", hi: "क्षेत्र अनुसार %" },
            matrixRows: [
              { value: "Agriculture", label: { en: "Agriculture", hi: "कृषि" } },
              { value: "Handicraft", label: { en: "Handicraft", hi: "हस्तशिल्प" } },
              { value: "ForestProduce", label: { en: "Forest produce", hi: "वन उपज" } },
              { value: "Other", label: { en: "Other", hi: "अन्य" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Sector", hi: "क्षेत्र" } },
              { value: "percent", label: { en: "%", hi: "%" }, inputType: "number" },
            ],
            dmfEligible: { en: "SHG support", hi: "SHG सहायता" },
            parentId: null,
          },
          {
            qid: "G1.4",
            title: {
              en: "Are any FPOs (Farmer Producer Organisations) / cooperatives active in the village?",
              hi: "क्या गांव में कोई FPO (किसान उत्पादक संगठन) / सहकारी सक्रिय है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; No.", hi: "हां/नहीं; संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "No. of FPOs/cooperatives", hi: "FPO/सहकारी संख्या" },
                detail: { mode: "text", placeholder: "Enter count" },
              },
            ],
            dmfEligible: { en: "FPO / cooperative support", hi: "FPO / सहकारी समर्थन" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "G2. Livelihood gaps",
          hi: "जी2. आजीविका कमियां",
        },
        questions: [
          {
            qid: "G2.1",
            title: {
              en: "Primary occupation of households (farming / mining labour / forest produce / daily wage / other)?",
              hi: "परिवारों की प्राथमिक आजीविका (खेती / खनन मजदूरी / वन उपज / दैनिक मजदूरी / अन्य)?",
            },
            type: "small_matrix",
            uom: { en: "% by occupation type", hi: "आजीविका प्रकार अनुसार %" },
            parentId: null,
            matrixRows: [
              { value: "Farming", label: { en: "Farming", hi: "खेती" } },
              { value: "MiningLabour", label: { en: "Mining labour", hi: "खनन मजदूरी" } },
              { value: "ForestProduce", label: { en: "Forest produce", hi: "वन उपज" } },
              { value: "DailyWage", label: { en: "Daily wage", hi: "दैनिक मजदूरी" } },
              { value: "Other", label: { en: "Other", hi: "अन्य" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Occupation", hi: "आजीविका" } },
              { value: "percent", label: { en: "%", hi: "%" }, inputType: "number" },
            ],
          },
          {
            qid: "G2.2",
            title: {
              en: "Do mining-affected families face livelihood displacement? No. of families affected.",
              hi: "क्या खनन-प्रभावित परिवारों को आजीविका विस्थापन का सामना करना पड़ रहा है? प्रभावित परिवारों की संख्या।",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of families", hi: "हां/नहीं; परिवार संख्या" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "No. of families affected", hi: "प्रभावित परिवार संख्या" },
                detail: { mode: "text", placeholder: "Enter count" },
              },
            ],
            dmfEligible: { en: "Self-employment schemes", hi: "स्वरोजगार योजनाएं" },
            parentId: null,
          },
          {
            qid: "G2.3",
            title: {
              en: "Are community / tribal arts and crafts practiced? Type and market access status.",
              hi: "क्या सामुदायिक / जनजातीय कला-शिल्प का अभ्यास होता है? प्रकार और बाज़ार पहुंच स्थिति।",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; MFP; Volume; Processing access", hi: "हां/नहीं; MFP; मात्रा; प्रसंस्करण पहुंच" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "MFP, volume and processing access", hi: "MFP, मात्रा और प्रसंस्करण पहुंच" },
                detail: {
                  mode: "small_matrix",
                  matrixRows: [{ value: "Details", label: { en: "Details", hi: "विवरण" } }],
                  matrixCols: [
                    { value: "item", label: { en: "Item", hi: "वस्तु" } },
                    { value: "MFP", label: { en: "MFP", hi: "MFP" }, inputType: "text" },
                    { value: "Volume", label: { en: "Volume", hi: "मात्रा" }, inputType: "number" },
                    {
                      value: "ProcessingAccess",
                      label: { en: "Processing access", hi: "प्रसंस्करण पहुंच" },
                      inputType: "dropdown",
                      dropdownOptions: yesNo,
                    },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Arts & crafts improvement and showcase", hi: "कला-शिल्प सुधार एवं प्रदर्शन" },
            parentId: null,
          },
          {
            qid: "G2.4",
            title: {
              en: "Is minor forest produce (MFP) collected in the village?",
              hi: "क्या गांव में लघु वन उपज (MFP) का संग्रह होता है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Details if Yes", hi: "हां/नहीं; विवरण यदि हां" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "MFP types, volume, processing access", hi: "MFP प्रकार, मात्रा, प्रसंस्करण पहुंच" },
                detail: { mode: "text", placeholder: "Enter types, volume, processing access" },
              },
            ],
            dmfEligible: { en: "MFP collection & processing", hi: "MFP संग्रह एवं प्रसंस्करण" },
            parentId: null,
          },
          {
            qid: "G2.5",
            title: {
              en: "Is there an incubation centre / startup support for self-employment in the block?",
              hi: "क्या ब्लॉक में स्वरोजगार हेतु इन्क्यूबेशन केंद्र / स्टार्टअप सहायता है?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance", hi: "हां/नहीं; दूरी" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "No",
                detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" },
                detail: { mode: "number", placeholder: "Enter distance in km" },
              },
            ],
            dmfEligible: { en: "Incubation centre", hi: "इन्क्यूबेशन केंद्र" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "G3. Training & forward linkages",
          hi: "जी3. प्रशिक्षण एवं अग्र संपर्क",
        },
        questions: [
          {
            qid: "G3.1",
            title: {
              en: "Top skill training needs identified by youth / women in the village (Top 3 trades)",
              hi: "गांव के युवाओं / महिलाओं द्वारा पहचानी गई शीर्ष कौशल प्रशिक्षण आवश्यकताएं (Top 3 ट्रेड)",
            },
            type: "text",
            uom: { en: "Trades — ranked", hi: "ट्रेड — क्रमबद्ध" },
            dmfEligible: { en: "Training — skill development", hi: "प्रशिक्षण — कौशल विकास" },
            parentId: null,
          },
          {
            qid: "G3.2",
            title: {
              en: "Are backward / forward market linkages available for SHG products / MFP?",
              hi: "क्या SHG उत्पादों / MFP हेतु पश्च / अग्र बाज़ार संपर्क उपलब्ध हैं?",
            },
            type: "conditional_options",
            uom: { en: "Yes/No; Type of linkage", hi: "हां/नहीं; संपर्क प्रकार" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Type of linkage", hi: "संपर्क प्रकार" },
                detail: { mode: "text", placeholder: "Forward/backward/both — describe" },
              },
            ],
            dmfEligible: { en: "Forward & backward linkages", hi: "अग्र एवं पश्च संपर्क" },
            parentId: null,
          },
          {
            qid: "G3.3",
            title: {
              en: "Estimated investment needed for priority livelihood programme (Rs. Lakh)",
              hi: "प्राथमिक आजीविका कार्यक्रम हेतु आवश्यक अनुमानित निवेश (₹ लाख)",
            },
            type: "number",
            uom: { en: "Rs. Lakh", hi: "लाख रुपये" },
            dmfEligible: { en: "DMFT livelihood investment", hi: "डीएमएफटी आजीविका निवेश" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "G4. Skill & livelihood gap matrix",
          hi: "जी4. कौशल एवं आजीविका गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "G4.1",
            title: { en: "Skill and livelihood gap matrix", hi: "कौशल और आजीविका गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "SHGs", label: { en: "SHGs", hi: "SHG" } },
              { value: "FPOs", label: { en: "FPOs", hi: "FPO" } },
              { value: "TrainingPrograms", label: { en: "Training Programs", hi: "प्रशिक्षण कार्यक्रम" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.G,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "H",
    title: { en: "Sanitation", hi: "स्वच्छता" },
    ruleRef: "Rule 22(2)(h) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Waste collection, transport, disposal, drainage, sewage treatment, fecal sludge disposal, toilets and related activities.",
      hi: "पात्र: कचरा संग्रहण, परिवहन, निपटान, ड्रेनेज, सीवेज उपचार, फीकल स्लज निपटान और शौचालय संबंधित कार्य।",
    },
    order: [
      {
        title: { en: "H1. Solid waste management", hi: "एच1. ठोस अपशिष्ट प्रबंधन" },
        questions: [
          {
            qid: "H1.1",
            title: { en: "Is there a door-to-door solid waste collection system in the village?", hi: "क्या गांव में घर-घर कचरा संग्रहण प्रणाली है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Frequency", hi: "हां/नहीं; आवृत्ति" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Frequency", hi: "आवृत्ति" }, detail: { mode: "text", placeholder: "Daily/weekly etc." } }],
            dmfEligible: { en: "Waste collection & transportation", hi: "कचरा संग्रहण और परिवहन" },
            parentId: null,
          },
          {
            qid: "H1.2",
            title: { en: "Is there a designated waste disposal / landfill site for the village?", hi: "क्या गांव के लिए निर्धारित कचरा निपटान/लैंडफिल स्थल है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance (km)", hi: "हां/नहीं; दूरी (किमी)" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" }, detail: { mode: "text", placeholder: "Enter distance" } }],
            dmfEligible: { en: "Waste disposal", hi: "कचरा निपटान" },
            parentId: null,
          },
          {
            qid: "H1.3",
            title: { en: "Is mining waste mixed with household waste?", hi: "क्या खनन अपशिष्ट घरेलू कचरे के साथ मिल रहा है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type", hi: "हां/नहीं; प्रकार" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Type", hi: "प्रकार" }, detail: { mode: "text", placeholder: "Overburden/tailings/chemical etc." } }],
            dmfEligible: { en: "Waste disposal — mining context", hi: "कचरा निपटान — खनन संदर्भ" },
            parentId: null,
          },
          {
            qid: "H1.4",
            title: { en: "Is regular cleaning of public places done?", hi: "क्या सार्वजनिक स्थलों की नियमित सफाई होती है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Frequency", hi: "हां/नहीं; आवृत्ति" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Frequency", hi: "आवृत्ति" }, detail: { mode: "text", placeholder: "Enter frequency" } }],
            dmfEligible: { en: "Cleaning of public places", hi: "सार्वजनिक स्थल सफाई" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "H2. Drainage & liquid waste", hi: "एच2. ड्रेनेज एवं तरल अपशिष्ट" },
        questions: [
          {
            qid: "H2.1",
            title: { en: "Is there a drainage network in the village?", hi: "क्या गांव में ड्रेनेज नेटवर्क है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Coverage %", hi: "हां/नहीं; कवरेज %" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Coverage %", hi: "कवरेज %" }, detail: { mode: "text", placeholder: "Enter %" } }],
            dmfEligible: { en: "Proper drainage provision", hi: "उचित ड्रेनेज प्रावधान" },
            parentId: null,
          },
          {
            qid: "H2.2",
            title: { en: "Does stagnant wastewater remain for extended periods?", hi: "क्या गंदा पानी लंबे समय तक ठहरा रहता है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Duration (days)", hi: "हां/नहीं; अवधि (दिन)" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Duration (days)", hi: "अवधि (दिन)" }, detail: { mode: "text", placeholder: "Enter days" } }],
            dmfEligible: { en: "Drainage provision", hi: "ड्रेनेज प्रावधान" },
            parentId: null,
          },
          {
            qid: "H2.3",
            title: { en: "Is there a sewage treatment plant (STP) / wastewater treatment facility?", hi: "क्या सीवेज ट्रीटमेंट प्लांट (STP) / वेस्टवॉटर उपचार सुविधा है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Capacity", hi: "हां/नहीं; क्षमता" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Capacity", hi: "क्षमता" }, detail: { mode: "text", placeholder: "Enter capacity" } }],
            dmfEligible: { en: "Sewage treatment plant", hi: "सीवेज उपचार संयंत्र" },
            parentId: null,
          },
          {
            qid: "H2.4",
            title: { en: "Is fecal sludge management system in place?", hi: "क्या फीकल स्लज प्रबंधन प्रणाली लागू है?" },
            type: "options",
            uom: { en: "Yes/No", hi: "हां/नहीं" },
            options: yesNo,
            dmfEligible: { en: "Fecal sludge disposal", hi: "फीकल स्लज निपटान" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "H3. Toilets / ODF status", hi: "एच3. शौचालय / ODF स्थिति" },
        questions: [
          {
            qid: "H3.1",
            title: { en: "ODF status of the village", hi: "गांव की ODF स्थिति" },
            type: "options",
            uom: { en: "ODF / ODF+ / ODF++ / Not ODF", hi: "ODF / ODF+ / ODF++ / Not ODF" },
            options: [
              { value: "ODF", label: { en: "ODF", hi: "ODF" } },
              { value: "ODF+", label: { en: "ODF+", hi: "ODF+" } },
              { value: "ODF++", label: { en: "ODF++", hi: "ODF++" } },
              { value: "NotODF", label: { en: "Not ODF", hi: "Not ODF" } },
            ],
            parentId: null,
          },
          {
            qid: "H3.2",
            title: { en: "No. of households with individual latrines (functional/non-functional)", hi: "व्यक्तिगत शौचालय वाले घर (कार्यशील/अकार्यशील)" },
            type: "text",
            uom: { en: "Functional; Non-functional", hi: "कार्यशील; अकार्यशील" },
            dmfEligible: { en: "Provision of toilets", hi: "शौचालय प्रावधान" },
            parentId: null,
          },
          {
            qid: "H3.3",
            title: { en: "No. of community/public toilet complexes", hi: "सामुदायिक/सार्वजनिक शौचालय परिसर" },
            type: "text",
            uom: { en: "No.; Locations", hi: "संख्या; स्थान" },
            dmfEligible: { en: "Provision of toilets", hi: "शौचालय प्रावधान" },
            parentId: null,
          },
          {
            qid: "H3.4",
            title: { en: "No. of household toilets still needed to achieve ODF", hi: "ODF हेतु आवश्यक शेष घरेलू शौचालय संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            matrixDefaultValue: "0",
            dmfEligible: { en: "Provision of toilets", hi: "शौचालय प्रावधान" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "H4. Sanitation – gap matrix", hi: "एच4. स्वच्छता गैप मैट्रिक्स" },
        questions: [
          {
            qid: "H4.1",
            title: { en: "Sanitation gap matrix", hi: "स्वच्छता गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "SolidWasteCollection", label: { en: "Solid waste collection system", hi: "ठोस कचरा संग्रहण प्रणाली" } },
              { value: "WasteDisposal", label: { en: "Waste disposal / transfer station", hi: "कचरा निपटान / ट्रांसफर स्टेशन" } },
              { value: "DrainageNetwork", label: { en: "Village drainage network (km)", hi: "गांव ड्रेनेज नेटवर्क (किमी)" } },
              { value: "STP", label: { en: "Sewage Treatment Plant (STP)", hi: "सीवेज ट्रीटमेंट प्लांट (STP)" } },
              { value: "CommunityToilets", label: { en: "Community toilet complexes", hi: "सामुदायिक शौचालय परिसर" } },
              { value: "IHHL", label: { en: "Household toilets (IHHL)", hi: "घरेलू शौचालय (IHHL)" } },
              { value: "FecalSludge", label: { en: "Fecal sludge management", hi: "फीकल स्लज प्रबंधन" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "I",
    title: { en: "Housing", hi: "आवास" },
    ruleRef: "Rule 22(2)(i) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Pucca housing support for mining-affected persons not covered under Central/State housing schemes.",
      hi: "पात्र: केंद्रीय/राज्य योजनाओं से वंचित खनन-प्रभावित व्यक्तियों के लिए पक्का आवास सहायता।",
    },
    order: [
      {
        title: { en: "I1. Housing stock assessment", hi: "आई1. आवास स्थिति आकलन" },
        questions: [
          {
            qid: "I1.1",
            title: { en: "Total households breakdown (Pucca / Semi-Pucca / Kutcha)", hi: "कुल परिवार वर्गीकरण (पक्का / अर्ध-पक्का / कच्चा)" },
            type: "small_matrix",
            uom: { en: "No. of households", hi: "परिवार संख्या" },
            parentId: null,
            matrixRows: [
              { value: "Pucca", label: { en: "Pucca", hi: "पक्का" } },
              { value: "SemiPucca", label: { en: "Semi-Pucca", hi: "अर्ध-पक्का" } },
              { value: "Kutcha", label: { en: "Kutcha", hi: "कच्चा" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "count", label: { en: "No. of HH", hi: "परिवार संख्या" }, inputType: "number" },
            ],
          },
          {
            qid: "I1.2",
            title: { en: "No. of households living in kutcha/dilapidated housing requiring pucca housing", hi: "कच्चे/जर्जर घरों में रहने वाले परिवार जिनको पक्का आवास चाहिए" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            dmfEligible: { en: "Pucca housing — mining-affected", hi: "पक्का आवास — खनन प्रभावित" },
            parentId: null,
          },
          {
            qid: "I1.3",
            title: { en: "Are any households homeless/living on mine land/displaced due to mining?", hi: "क्या कोई परिवार बेघर/माइन भूमि पर/खनन से विस्थापित है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of HH", hi: "हां/नहीं; परिवार संख्या" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. of HH", hi: "परिवार संख्या" }, detail: { mode: "text", placeholder: "Enter count" } }],
            dmfEligible: { en: "Housing — mining-displaced persons", hi: "आवास — खनन विस्थापित" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "I2. Scheme coverage & exclusion", hi: "आई2. योजना कवरेज एवं वंचना" },
        questions: [
          {
            qid: "I2.1",
            title: { en: "No. of households covered under PMAY-G", hi: "PMAY-G के अंतर्गत आवृत परिवार संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            parentId: null,
          },
          {
            qid: "I2.2",
            title: { en: "No. of households covered under State housing schemes", hi: "राज्य आवास योजनाओं के अंतर्गत आवृत परिवार संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            parentId: null,
          },
          {
            qid: "I2.3",
            title: { en: "No. of mining-affected households required for Awas Yojna", hi: "आवास योजना हेतु आवश्यक खनन-प्रभावित परिवार संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            dmfEligible: { en: "Pucca housing — DMFT gap-filling", hi: "पक्का आवास — डीएमएफटी गैप-फिलिंग" },
            parentId: null,
          },
          {
            qid: "I2.4",
            title: { en: "No. of kutcha/dilapidated households required for Awas Yojna", hi: "आवास योजना हेतु आवश्यक कच्चे/जर्जर घर वाले परिवार संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            parentId: null,
          },
          {
            qid: "I2.5",
            title: { en: "No. of homeless/displaced households required for Awas Yojna", hi: "आवास योजना हेतु आवश्यक बेघर/विस्थापित परिवार संख्या" },
            type: "number",
            uom: { en: "Number", hi: "संख्या" },
            dmfEligible: { en: "DMFT housing investment", hi: "डीएमएफटी आवास निवेश" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "I3. Housing – gap matrix", hi: "आई3. आवास गैप मैट्रिक्स" },
        questions: [
          {
            qid: "I3.1",
            title: { en: "Housing gap matrix", hi: "आवास गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              {
                value: "HouseholdRequiredAwasYojna",
                label: {
                  en: "No. of Household Required for Awas Yojna",
                  hi: "आवास योजना हेतु आवश्यक परिवार संख्या",
                },
              },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.I,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "J",
    title: { en: "Agriculture", hi: "कृषि" },
    ruleRef: "Rule 22(2)(j) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Agriculture/horticulture/agroforestry support, farmer training, FPO/cooperative support, food processing, cold storage, market yards.",
      hi: "पात्र: कृषि/बागवानी/एग्रोफॉरेस्ट्री सहायता, किसान प्रशिक्षण, FPO/सहकारी समर्थन, फूड प्रोसेसिंग, कोल्ड स्टोरेज, मंडी सुविधाएं।",
    },
    order: [
      {
        title: { en: "J1. Agricultural profile", hi: "जे1. कृषि प्रोफाइल" },
        questions: [
          {
            qid: "J1.1",
            title: { en: "Total agricultural land (ha): irrigated/rainfed/fallow", hi: "कुल कृषि भूमि (हे): सिंचित/वर्षा-आश्रित/परती" },
            type: "small_matrix",
            uom: { en: "Sector; Area (ha)", hi: "सेक्टर; क्षेत्र (हे)" },
            matrixRows: [
              { value: "Irrigated", label: { en: "Irrigated", hi: "सिंचित" } },
              { value: "Rainfed", label: { en: "Rainfed", hi: "वर्षा-आश्रित" } },
              { value: "Fallow", label: { en: "Fallow", hi: "परती" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Sector", hi: "सेक्टर" } },
              { value: "area", label: { en: "Area (ha)", hi: "क्षेत्र (हे)" }, inputType: "number" },
            ],
            parentId: null,
          },
          {
            qid: "J1.2",
            title: { en: "Primary crops grown by season (kharif/rabi/horticulture)", hi: "मौसमानुसार प्रमुख फसलें (खरीफ/रबी/बागवानी)" },
            type: "conditional_options",
            uom: { en: "Select seasons", hi: "मौसम चुनें" },
            options: [{ value: "Selected", label: { en: "Select", hi: "चयन करें" } }],
            conditionalRules: [
              {
                triggerValue: "Selected",
                detailLabel: { en: "Seasons", hi: "मौसम" },
                detail: {
                  mode: "multi",
                  options: [
                    { value: "Kharif", label: { en: "Kharif", hi: "खरीफ" } },
                    { value: "Rabi", label: { en: "Rabi", hi: "रबी" } },
                    { value: "Horticulture", label: { en: "Horticulture", hi: "बागवानी" } },
                  ],
                },
              },
            ],
            parentId: null,
          },
          {
            qid: "J1.3",
            title: { en: "Has agricultural land been degraded/lost due to mining?", hi: "क्या खनन से कृषि भूमि क्षतिग्रस्त/नष्ट हुई है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Area (ha)", hi: "हां/नहीं; क्षेत्र (हेक्टेयर)" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Area (ha)", hi: "क्षेत्र (हेक्टेयर)" }, detail: { mode: "text", placeholder: "Enter area" } }],
            dmfEligible: { en: "Agroforestry / land restoration", hi: "एग्रोफॉरेस्ट्री / भूमि पुनर्स्थापन" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "J2. Agriculture support infrastructure", hi: "जे2. कृषि सहायक अवसंरचना" },
        questions: [
          {
            qid: "J2.1",
            title: { en: "Is there a PACS/FPO/cooperative in the village or nearby?", hi: "क्या गांव/आसपास PACS/FPO/सहकारी उपलब्ध है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Name; Distance", hi: "हां/नहीं; नाम; दूरी" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Name and distance", hi: "नाम और दूरी" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "FPO / cooperative support", hi: "FPO / सहकारी समर्थन" },
            parentId: null,
          },
          {
            qid: "J2.2",
            title: { en: "Is there any accessible food processing unit?", hi: "क्या सुलभ फूड प्रोसेसिंग यूनिट उपलब्ध है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type", hi: "हां/नहीं; प्रकार" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Type", hi: "प्रकार" }, detail: { mode: "text", placeholder: "Dal mill/oil mill/rice mill etc." } }],
            dmfEligible: { en: "Food processing units", hi: "फूड प्रोसेसिंग यूनिट" },
            parentId: null,
          },
          {
            qid: "J2.3",
            title: { en: "Is cold storage accessible for horticulture/vegetables?", hi: "क्या बागवानी/सब्जियों हेतु कोल्ड स्टोरेज सुलभ है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance", hi: "हां/नहीं; दूरी" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "No", detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" }, detail: { mode: "number", placeholder: "Enter distance in km" } }],
            dmfEligible: { en: "Cold storage facility", hi: "कोल्ड स्टोरेज सुविधा" },
            parentId: null,
          },
          {
            qid: "J2.4",
            title: { en: "Is there a market yard/haat/primary market for farm produce?", hi: "क्या कृषि उपज हेतु मंडी/हाट उपलब्ध है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance", hi: "हां/नहीं; दूरी" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "No", detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" }, detail: { mode: "number", placeholder: "Enter distance in km" } }],
            dmfEligible: { en: "Market yard / marketing facilities", hi: "मंडी / विपणन सुविधाएं" },
            parentId: null,
          },
          {
            qid: "J2.5",
            title: { en: "Are farmers engaged in agroforestry/plantation/bamboo/medicinal herbs?", hi: "क्या किसान एग्रोफॉरेस्ट्री/रोपण/बांस/औषधीय पौधों में संलग्न हैं?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Area; Type", hi: "हां/नहीं; क्षेत्र; प्रकार" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Area and type", hi: "क्षेत्र और प्रकार" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "Plantation / agroforestry / medicinal herbs", hi: "रोपण / एग्रोफॉरेस्ट्री / औषधीय पौधे" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "J3. Training & extension", hi: "जे3. प्रशिक्षण एवं विस्तार" },
        questions: [
          {
            qid: "J3.1",
            title: { en: "No. of farmers receiving KVK/agriculture extension services", hi: "KVK/कृषि विस्तार सेवाएं पाने वाले किसानों की संख्या" },
            type: "text",
            uom: { en: "Number; Frequency", hi: "संख्या; आवृत्ति" },
            dmfEligible: { en: "Farmer training", hi: "किसान प्रशिक्षण" },
            parentId: null,
          },
          {
            qid: "J3.2",
            title: { en: "Are farmers trained in soil health/organic farming/post-harvest management?", hi: "क्या किसानों को मृदा स्वास्थ्य/जैविक खेती/कटाई-पश्चात प्रबंधन का प्रशिक्षण मिला है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; % of farmers", hi: "हां/नहीं; किसानों का %" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "% of farmers", hi: "किसानों का %" }, detail: { mode: "text", placeholder: "Enter percentage" } }],
            dmfEligible: { en: "Farmer training through DMFT", hi: "डीएमएफटी के माध्यम से किसान प्रशिक्षण" },
            parentId: null,
          },
          {
            qid: "J3.3",
            title: { en: "Top agricultural support need identified by farmers (Top 3)", hi: "किसानों द्वारा पहचानी गई शीर्ष कृषि आवश्यकताएं (Top 3)" },
            type: "text",
            uom: { en: "Text — ranked", hi: "पाठ — क्रमबद्ध" },
            dmfEligible: { en: "Priority DMFT agriculture investment", hi: "प्राथमिक डीएमएफटी कृषि निवेश" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "J4. Agriculture – gap matrix", hi: "जे4. कृषि गैप मैट्रिक्स" },
        questions: [
          {
            qid: "J4.1",
            title: { en: "Agriculture gap matrix", hi: "कृषि गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "FoodProcessingUnits", label: { en: "Food Processing Units", hi: "फूड प्रोसेसिंग यूनिट" } },
              { value: "ColdStorage", label: { en: "Cold Storage", hi: "कोल्ड स्टोरेज" } },
              { value: "KVK", label: { en: "KVK", hi: "KVK" } },
              { value: "AgricultureExtensionServices", label: { en: "Agriculture extension services", hi: "कृषि विस्तार सेवाएं" } },
              { value: "TrainingSoilHealth", label: { en: "Training soil health", hi: "मृदा स्वास्थ्य प्रशिक्षण" } },
              { value: "TrainingOrganicFarming", label: { en: "Training organic farming", hi: "जैविक खेती प्रशिक्षण" } },
              { value: "TrainingPostHarvestManagement", label: { en: "Training post-harvest management", hi: "कटाई-पश्चात प्रबंधन प्रशिक्षण" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.J,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "K",
    title: { en: "Animal Husbandry", hi: "पशुपालन" },
    ruleRef: "Rule 22(2)(k) — High Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Livestock, poultry, fishery promotion, feed/fodder development, innovation support, and group/cooperative strengthening.",
      hi: "पात्र: पशुधन/पोल्ट्री/मत्स्य प्रोत्साहन, चारा विकास, नवाचार समर्थन और समूह/सहकारी सुदृढ़ीकरण।",
    },
    order: [
      {
        title: { en: "K1. Livestock profile", hi: "के1. पशुधन प्रोफाइल" },
        questions: [
          {
            qid: "K1.1",
            title: { en: "Total livestock in village (cattle/buffalo/goat/sheep/pig/poultry)", hi: "गांव में कुल पशुधन (गाय/भैंस/बकरी/भेड़/सुअर/पोल्ट्री)" },
            type: "small_matrix",
            uom: { en: "Nos. by type", hi: "प्रकारानुसार संख्या" },
            parentId: null,
            matrixRows: [
              { value: "Cattle", label: { en: "Cattle", hi: "गाय" } },
              { value: "Buffalo", label: { en: "Buffalo", hi: "भैंस" } },
              { value: "Goat", label: { en: "Goat", hi: "बकरी" } },
              { value: "Sheep", label: { en: "Sheep", hi: "भेड़" } },
              { value: "Pig", label: { en: "Pig", hi: "सुअर" } },
              { value: "Poultry", label: { en: "Poultry", hi: "पोल्ट्री" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "count", label: { en: "No.", hi: "संख्या" }, inputType: "number" },
            ],
          },
          {
            qid: "K1.2",
            title: { en: "No. of households dependent on animal husbandry as primary/secondary livelihood", hi: "पशुपालन पर निर्भर परिवार (मुख्य/द्वितीयक आजीविका)" },
            type: "small_matrix",
            uom: { en: "No. of HH by dependency", hi: "निर्भरता अनुसार परिवार संख्या" },
            dmfEligible: { en: "Livestock promotion", hi: "पशुधन प्रोत्साहन" },
            parentId: null,
            matrixRows: [
              { value: "Primary", label: { en: "Primary livelihood", hi: "मुख्य आजीविका" } },
              { value: "Secondary", label: { en: "Secondary livelihood", hi: "द्वितीयक आजीविका" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Dependency", hi: "निर्भरता" } },
              { value: "count", label: { en: "No. of HH", hi: "परिवार संख्या" }, inputType: "number" },
            ],
          },
          {
            qid: "K1.3",
            title: { en: "Has livestock been adversely affected by mining pollution?", hi: "क्या खनन प्रदूषण से पशुधन प्रभावित हुआ है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type of impact", hi: "हां/नहीं; प्रभाव का प्रकार" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Type of impact", hi: "प्रभाव प्रकार" }, detail: { mode: "text", placeholder: "Feed/water contamination/disease etc." } }],
            parentId: null,
          },
        ],
      },
      {
        title: { en: "K2. Veterinary & support infrastructure", hi: "के2. पशु चिकित्सा एवं सहायक अवसंरचना" },
        questions: [
          {
            qid: "K2.1",
            title: { en: "Is there a veterinary dispensary/sub-centre nearby?", hi: "क्या पास में पशु चिकित्सालय/उपकेंद्र है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance (km) if No", hi: "हां/नहीं; दूरी (किमी) यदि नहीं" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "No", detailLabel: { en: "Distance (km)", hi: "दूरी (किमी)" }, detail: { mode: "number", placeholder: "Enter distance in km" } }],
            dmfEligible: { en: "Animal husbandry support infrastructure", hi: "पशुपालन सहायक अवसंरचना" },
            parentId: null,
          },
          {
            qid: "K2.2",
            title: { en: "Availability of AI and vaccination services for livestock", hi: "पशुधन हेतु AI और टीकाकरण सेवाओं की उपलब्धता" },
            type: "conditional_options",
            uom: { en: "Yes/No; Frequency", hi: "हां/नहीं; आवृत्ति" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Frequency", hi: "आवृत्ति" }, detail: { mode: "text", placeholder: "Enter frequency" } }],
            dmfEligible: { en: "Livestock innovation support", hi: "पशुधन नवाचार समर्थन" },
            parentId: null,
          },
          {
            qid: "K2.3",
            title: { en: "Is feed/fodder availability adequate throughout the year?", hi: "क्या पूरे वर्ष चारा उपलब्धता पर्याप्त है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Gap months", hi: "हां/नहीं; कमी के महीने" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "No", detailLabel: { en: "Gap months", hi: "कमी के महीने" }, detail: { mode: "text", placeholder: "Enter months" } }],
            dmfEligible: { en: "Feed & fodder development", hi: "चारा विकास" },
            parentId: null,
          },
          {
            qid: "K2.4",
            title: { en: "Is fishery/fish pond/aquaculture practiced in the village?", hi: "क्या गांव में मत्स्य पालन/तालाब/एक्वाकल्चर होता है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Area; Species", hi: "हां/नहीं; क्षेत्र; प्रजाति" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Area and species", hi: "क्षेत्र और प्रजाति" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "Fishery promotion", hi: "मत्स्य प्रोत्साहन" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "K3. Organised groups & markets", hi: "के3. संगठित समूह एवं बाज़ार" },
        questions: [
          {
            qid: "K3.1",
            title: { en: "Is there an active dairy cooperative/livestock FPO/SHG/FCO?", hi: "क्या सक्रिय डेयरी सहकारी/पशुधन FPO/SHG/FCO है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type; Name", hi: "हां/नहीं; प्रकार; नाम" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Type and name", hi: "प्रकार और नाम" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "FPO / SHG / FCO support", hi: "FPO / SHG / FCO समर्थन" },
            parentId: null,
          },
          {
            qid: "K3.2",
            title: { en: "Is there market access / milk collection / poultry aggregation point nearby?", hi: "क्या पास में बाज़ार/दूध संग्रह/पोल्ट्री एग्रीगेशन पॉइंट है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Distance", hi: "हां/नहीं; दूरी" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Distance", hi: "दूरी" }, detail: { mode: "text", placeholder: "Enter distance" } }],
            dmfEligible: { en: "Livelihood forward linkages", hi: "आजीविका फॉरवर्ड लिंकज" },
            parentId: null,
          },
        ],
      },
      {
        title: {
          en: "K4. Animal husbandry – gap matrix",
          hi: "के4. पशुपालन गैप मैट्रिक्स",
        },
        questions: [
          {
            qid: "K4.1",
            title: { en: "Animal husbandry gap matrix", hi: "पशुपालन गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            dmfEligible: { en: "DMFT animal husbandry investment", hi: "डीएमएफटी पशुपालन निवेश" },
            parentId: null,
            matrixRows: [
              { value: "ChickenFarm", label: { en: "Chicken Farm", hi: "मुर्गी पालन" } },
              { value: "Fishery", label: { en: "Fishery", hi: "मत्स्य पालन" } },
              { value: "FeedStock", label: { en: "Feed Stock", hi: "चारा स्टॉक" } },
              { value: "SHGTraining", label: { en: "Training for SHGs", hi: "SHG हेतु प्रशिक्षण" } },
            ],
            matrixCols: [
              { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
              { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.K,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "L",
    title: { en: "Physical Infrastructure", hi: "भौतिक अवसंरचना" },
    ruleRef: "Rule 22(3)(a) — Other Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Roads, bridges, railways and waterways projects under other priority sectors.",
      hi: "पात्र: सड़क, पुल, रेलवे और जलमार्ग परियोजनाएं (अन्य प्राथमिकता क्षेत्र)।",
    },
    order: [
      {
        title: { en: "L1. Road connectivity", hi: "एल1. सड़क संपर्क" },
        questions: [
          {
            qid: "L1.1",
            title: { en: "Is the village connected by an all-weather pucca road to block/district HQ?", hi: "क्या गांव ब्लॉक/जिला मुख्यालय से ऑल-वेदर पक्की सड़क से जुड़ा है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Road type or Distance", hi: "हां/नहीं; सड़क प्रकार या दूरी" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Road type", hi: "सड़क प्रकार" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "CC", label: { en: "CC", hi: "CC" } },
                    { value: "BT", label: { en: "BT", hi: "BT" } },
                    { value: "Gravel", label: { en: "Gravel", hi: "Gravel" } },
                    { value: "Katcha", label: { en: "Katcha", hi: "कच्चा" } },
                  ],
                },
              },
              {
                triggerValue: "No",
                detailLabel: { en: "Length to nearest connectivity point (km)", hi: "निकटतम संपर्क बिंदु तक दूरी (किमी)" },
                detail: { mode: "number", placeholder: "Enter distance in km" },
              },
            ],
            dmfEligible: { en: "Road infrastructure", hi: "सड़क अवसंरचना" },
            parentId: null,
          },
          {
            qid: "L1.2",
            title: { en: "Is road disrupted by mining activity?", hi: "क्या खनन गतिविधि से सड़क बाधित होती है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Severity", hi: "हां/नहीं; गंभीरता" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Severity", hi: "गंभीरता" }, detail: { mode: "single", options: [{ value: "Low", label: { en: "Low", hi: "कम" } }, { value: "Medium", label: { en: "Medium", hi: "मध्यम" } }, { value: "High", label: { en: "High", hi: "उच्च" } }] } }],
            dmfEligible: { en: "Road repair — mining-damaged", hi: "खनन-क्षतिग्रस्त सड़क मरम्मत" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "L2. Bridges & culverts", hi: "एल2. पुल एवं कल्वर्ट" },
        questions: [
          {
            qid: "L2.1",
            title: { en: "Are there missing bridges/causeways/culverts cutting off village/hamlets during rains?", hi: "क्या बारिश में गांव/टोले को काट देने वाले पुल/कॉजवे/कल्वर्ट की कमी है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Location", hi: "हां/नहीं; स्थान" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Location", hi: "स्थान" }, detail: { mode: "text", placeholder: "Enter location" } }],
            dmfEligible: { en: "Bridges / waterways infrastructure", hi: "पुल / जलमार्ग अवसंरचना" },
            parentId: null,
          },
          {
            qid: "L2.2",
            title: { en: "Estimated months road is cut off due to missing bridge/flooded causeway", hi: "गुम पुल/बाढ़ कॉजवे के कारण सड़क कटने के अनुमानित महीने" },
            type: "number",
            uom: { en: "Months/year", hi: "महीने/वर्ष" },
            dmfEligible: { en: "Bridge — DMFT eligible", hi: "पुल — डीएमएफटी पात्र" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "L3. Other physical infrastructure", hi: "एल3. अन्य भौतिक अवसंरचना" },
        questions: [
          {
            qid: "L3.1",
            title: { en: "Is there demand for waterway/jetty/ferry point infrastructure?", hi: "क्या जलमार्ग/जेटी/फेरी पॉइंट अवसंरचना की मांग है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type if Yes", hi: "हां/नहीं; प्रकार यदि हां" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "Type", hi: "प्रकार" },
                detail: {
                  mode: "single",
                  options: [
                    { value: "Waterway", label: { en: "Waterway", hi: "जलमार्ग" } },
                    { value: "Jetty", label: { en: "Jetty", hi: "जेटी" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Waterways projects", hi: "जलमार्ग परियोजनाएं" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "L4. Physical infrastructure – gap matrix", hi: "एल4. भौतिक अवसंरचना गैप मैट्रिक्स" },
        questions: [
          {
            qid: "L4.1",
            title: { en: "Physical infrastructure gap matrix", hi: "भौतिक अवसंरचना गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "AllWeatherRoad", label: { en: "All-weather road (km needed)", hi: "ऑल-वेदर सड़क (आवश्यक किमी)" } },
              { value: "InternalRoads", label: { en: "Internal village roads (km)", hi: "आंतरिक गांव सड़कें (किमी)" } },
              { value: "BridgesCulverts", label: { en: "Bridges / causeways / culverts (nos.)", hi: "पुल / कॉजवे / कल्वर्ट (संख्या)" } },
              { value: "FarmTrackCulverts", label: { en: "Culverts on farm access tracks (nos.)", hi: "फार्म ट्रैक पर कल्वर्ट (संख्या)" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "M",
    title: { en: "Irrigation", hi: "सिंचाई" },
    ruleRef: "Rule 22(3)(b) — Other Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Alternate irrigation sources, check dams/diversion weirs, micro irrigation, borewell and pump energization.",
      hi: "पात्र: वैकल्पिक सिंचाई स्रोत, चेकडैम/डायवर्जन वीयर, माइक्रो सिंचाई, बोरवेल एवं पंप ऊर्जाकरण।",
    },
    order: [
      {
        title: { en: "M1. Irrigation infrastructure status", hi: "एम1. सिंचाई अवसंरचना स्थिति" },
        questions: [
          {
            qid: "M1.1",
            title: { en: "Net sown area vs irrigated area (irrigation gap)", hi: "नेट बोया क्षेत्र बनाम सिंचित क्षेत्र (सिंचाई गैप)" },
            type: "facility_inputs",
            uom: { en: "NSA (ha); Irrigated (ha)", hi: "NSA (हे); सिंचित (हे)" },
            facilityInputType: "number",
            facilities: [
              { key: "NetSownArea", label: { en: "Net sown area (ha)", hi: "नेट बोया क्षेत्र (हे)" } },
              { key: "IrrigatedArea", label: { en: "Irrigated area (ha)", hi: "सिंचित क्षेत्र (हे)" } },
            ],
            dmfEligible: { en: "Alternate irrigation sources", hi: "वैकल्पिक सिंचाई स्रोत" },
            parentId: null,
          },
          {
            qid: "M1.2",
            title: { en: "Primary irrigation source", hi: "प्रमुख सिंचाई स्रोत" },
            type: "options",
            uom: { en: "Source type", hi: "स्रोत प्रकार" },
            options: [
              { value: "Canal", label: { en: "Canal", hi: "नहर" } },
              { value: "Borewell", label: { en: "Borewell", hi: "बोरवेल" } },
              { value: "Well", label: { en: "Well", hi: "कुआं" } },
              { value: "Tank", label: { en: "Tank", hi: "टैंक" } },
              { value: "Rainfed", label: { en: "Rain-fed", hi: "वर्षा-आश्रित" } },
            ],
            parentId: null,
          },
        ],
      },
      {
        title: { en: "M2. Advanced irrigation", hi: "एम2. उन्नत सिंचाई" },
        questions: [
          {
            qid: "M2.1",
            title: { en: "No. of farmers using micro/drip/sprinkler irrigation and % covered area", hi: "माइक्रो/ड्रिप/स्प्रिंकलर उपयोग करने वाले किसान एवं क्षेत्र %" },
            type: "small_matrix",
            uom: { en: "% area covered", hi: "% क्षेत्र आवृत" },
            dmfEligible: { en: "Micro irrigation / drip irrigation", hi: "माइक्रो सिंचाई / ड्रिप सिंचाई" },
            parentId: null,
            matrixRows: [
              { value: "Micro", label: { en: "Micro", hi: "माइक्रो" } },
              { value: "Drip", label: { en: "Drip", hi: "ड्रिप" } },
              { value: "Sprinkler", label: { en: "Sprinkler", hi: "स्प्रिंकलर" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "percent", label: { en: "% area", hi: "% क्षेत्र" }, inputType: "number" },
            ],
          },
          {
            qid: "M2.2",
            title: { en: "Is there any solar pump scheme under PM KUSUM or similar?", hi: "क्या PM KUSUM या समान योजना में सोलर पंप उपलब्ध है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No. covered", hi: "हां/नहीं; आवृत संख्या" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. covered", hi: "आवृत संख्या" }, detail: { mode: "text", placeholder: "Enter count" } }],
            dmfEligible: { en: "Pump energization — solar", hi: "पंप ऊर्जाकरण — सौर" },
            parentId: null,
          },
          {
            qid: "M2.3",
            title: { en: "Water source adequacy for current cropping pattern during summer/dry months", hi: "गर्मी/शुष्क महीनों में वर्तमान फसल पैटर्न हेतु जल स्रोत पर्याप्तता" },
            type: "conditional_options",
            uom: { en: "Adequate/Inadequate; Months of deficit", hi: "पर्याप्त/अपर्याप्त; कमी के महीने" },
            options: [
              { value: "Adequate", label: { en: "Adequate", hi: "पर्याप्त" } },
              { value: "Inadequate", label: { en: "Inadequate", hi: "अपर्याप्त" } },
            ],
            conditionalRules: [{ triggerValue: "Inadequate", detailLabel: { en: "Months of deficit", hi: "कमी के महीने" }, detail: { mode: "text", placeholder: "Enter months" } }],
            dmfEligible: { en: "Alternate irrigation sources", hi: "वैकल्पिक सिंचाई स्रोत" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "M3. Irrigation – gap matrix", hi: "एम3. सिंचाई गैप मैट्रिक्स" },
        questions: [
          {
            qid: "M3.1",
            title: { en: "Irrigation gap matrix", hi: "सिंचाई गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "CheckDams", label: { en: "Check dams / stop dams (nos.)", hi: "चेकडैम / स्टॉपडैम (संख्या)" } },
              { value: "DiversionWeirs", label: { en: "Diversion weirs (nos.)", hi: "डायवर्जन वीयर (संख्या)" } },
              { value: "IrrigationBorewells", label: { en: "Irrigation borewells (nos.)", hi: "सिंचाई बोरवेल (संख्या)" } },
              { value: "SolarPumps", label: { en: "Solar pump energization (nos.)", hi: "सौर पंप ऊर्जाकरण (संख्या)" } },
              { value: "ElectricPumps", label: { en: "Electric pump energization (nos.)", hi: "विद्युत पंप ऊर्जाकरण (संख्या)" } },
              { value: "DripCoverage", label: { en: "Drip / micro irrigation (ha coverage)", hi: "ड्रिप / माइक्रो सिंचाई (हेक्टेयर कवरेज)" } },
              { value: "FarmPonds", label: { en: "Farm ponds (nos.)", hi: "फार्म पॉन्ड (संख्या)" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "N",
    title: { en: "Energy & Watershed Development", hi: "ऊर्जा एवं जलागम विकास" },
    ruleRef: "Rule 22(3)(c)+(d) — Other Priority | Chhattisgarh DMFT Rules 2015",
    note: {
      en: "Eligible: Renewable energy, rainwater harvesting, watershed/catchment restoration, orchards/agroforestry, and environmental quality measures.",
      hi: "पात्र: नवीकरणीय ऊर्जा, वर्षाजल संचयन, जलागम/कैचमेंट पुनर्स्थापन, बागवानी/एग्रोफॉरेस्ट्री और पर्यावरण गुणवत्ता सुधार उपाय।",
    },
    order: [
      {
        title: { en: "N1. Energy access", hi: "एन1. ऊर्जा पहुंच" },
        questions: [
          {
            qid: "N1.1",
            title: { en: "Electrification status of the village", hi: "गांव की विद्युतीकरण स्थिति" },
            type: "conditional_options",
            uom: { en: "Status; % HH with connections", hi: "स्थिति; कनेक्शन वाले परिवार %" },
            options: [
              { value: "Fully", label: { en: "Fully electrified", hi: "पूर्ण विद्युतीकृत" } },
              { value: "Partially", label: { en: "Partially electrified", hi: "आंशिक विद्युतीकृत" } },
              { value: "Not", label: { en: "Not electrified", hi: "अविद्युतीकृत" } },
            ],
            conditionalRules: [
              {
                triggerValue: "Fully",
                detailLabel: { en: "% HH with connections", hi: "कनेक्शन वाले परिवार %" },
                detail: { mode: "number", placeholder: "Enter percentage" },
              },
              {
                triggerValue: "Partially",
                detailLabel: { en: "% HH with connections", hi: "कनेक्शन वाले परिवार %" },
                detail: { mode: "number", placeholder: "Enter percentage" },
              },
              {
                triggerValue: "Not",
                detailLabel: { en: "% HH with connections", hi: "कनेक्शन वाले परिवार %" },
                detail: { mode: "number", placeholder: "Enter percentage" },
              },
            ],
            parentId: null,
          },
          {
            qid: "N1.2",
            title: { en: "No. of households without electricity connection", hi: "बिजली कनेक्शन रहित परिवार संख्या" },
            type: "text",
            uom: { en: "Number; % of total HH", hi: "संख्या; कुल परिवार %" },
            dmfEligible: { en: "Decentralised solar / alternate energy", hi: "विकेन्द्रीकृत सौर / वैकल्पिक ऊर्जा" },
            parentId: null,
          },
          {
            qid: "N1.3",
            title: { en: "Is there a solar street lighting system in the village?", hi: "क्या गांव में सोलर स्ट्रीट लाइटिंग प्रणाली है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Functional; Defunct", hi: "हां/नहीं; कार्यशील; अकार्यशील" },
            options: yesNo,
            conditionalRules: [
              {
                triggerValue: "Yes",
                detailLabel: { en: "No. of lights", hi: "लाइटों की संख्या" },
                detail: {
                  mode: "inputs",
                  facilityInputType: "number",
                  facilities: [
                    { key: "functional", label: { en: "Functional (nos.)", hi: "कार्यशील (संख्या)" } },
                    { key: "defunct", label: { en: "Defunct (nos.)", hi: "अकार्यशील (संख्या)" } },
                  ],
                },
              },
            ],
            dmfEligible: { en: "Decentralised solar energy", hi: "विकेन्द्रीकृत सौर ऊर्जा" },
            parentId: null,
          },
          {
            qid: "N1.4",
            title: { en: "Is there a micro-hydel/community renewable energy system?", hi: "क्या माइक्रो-हाइडेल/सामुदायिक नवीकरणीय ऊर्जा प्रणाली है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Type; Capacity", hi: "हां/नहीं; प्रकार; क्षमता" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Type and capacity", hi: "प्रकार और क्षमता" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "Micro-hydel / renewable energy source", hi: "माइक्रो-हाइडेल / नवीकरणीय ऊर्जा स्रोत" },
            parentId: null,
          },
          {
            qid: "N1.5",
            title: { en: "Are solar home systems/pumps/panels provided to households?", hi: "क्या परिवारों को सोलर होम सिस्टम/पंप/पैनल प्रदान किए गए हैं?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No. covered", hi: "हां/नहीं; आवृत संख्या" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. covered", hi: "आवृत संख्या" }, detail: { mode: "text", placeholder: "Enter count" } }],
            dmfEligible: { en: "Decentralised solar energy", hi: "विकेन्द्रीकृत सौर ऊर्जा" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "N2. Rainwater harvesting & watershed", hi: "एन2. वर्षाजल संचयन एवं जलागम" },
        questions: [
          {
            qid: "N2.1",
            title: { en: "Is there any rainwater harvesting structure in the village?", hi: "क्या गांव में वर्षाजल संचयन संरचना है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No.; Type", hi: "हां/नहीं; संख्या; प्रकार" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. and type", hi: "संख्या और प्रकार" }, detail: { mode: "text", placeholder: "RWH/percolation/recharge etc." } }],
            dmfEligible: { en: "Rainwater harvesting system", hi: "वर्षाजल संचयन प्रणाली" },
            parentId: null,
          },
          {
            qid: "N2.2",
            title: { en: "Area under watershed development/catchment treatment", hi: "जलागम विकास/कैचमेंट उपचार अंतर्गत क्षेत्र" },
            type: "text",
            uom: { en: "Ha; Scheme name", hi: "हेक्टेयर; योजना नाम" },
            dmfEligible: { en: "Watershed development / catchment restoration", hi: "जलागम विकास / कैचमेंट पुनर्स्थापन" },
            parentId: null,
          },
          {
            qid: "N2.3",
            title: { en: "Are streams/nalas/springs being recharged through watershed works?", hi: "क्या जलागम कार्यों से धारा/नाला/स्प्रिंग रिचार्ज हो रहे हैं?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No. of structures", hi: "हां/नहीं; संरचनाओं की संख्या" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. of structures", hi: "संरचना संख्या" }, detail: { mode: "text", placeholder: "Enter count" } }],
            dmfEligible: { en: "Catchment restoration", hi: "कैचमेंट पुनर्स्थापन" },
            parentId: null,
          },
          {
            qid: "N2.4",
            title: { en: "Is there a water body needing deepening/desilting/restoration?", hi: "क्या कोई जल निकाय गहरीकरण/डिसिल्टिंग/पुनर्स्थापन हेतु आवश्यक है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; No.; Capacity", hi: "हां/नहीं; संख्या; क्षमता" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "No. and capacity", hi: "संख्या और क्षमता" }, detail: { mode: "text", placeholder: "Enter details" } }],
            dmfEligible: { en: "Environmental quality — watershed restoration", hi: "पर्यावरण गुणवत्ता — जलागम पुनर्स्थापन" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "N3. Orchard, agroforestry & environmental measures", hi: "एन3. बागवानी, एग्रोफॉरेस्ट्री एवं पर्यावरण उपाय" },
        questions: [
          {
            qid: "N3.1",
            title: { en: "Area suitable for orchard development/horticulture on degraded mining land", hi: "क्षतिग्रस्त खनन भूमि पर बागवानी हेतु उपयुक्त क्षेत्र" },
            type: "text",
            uom: { en: "Ha; Suitability", hi: "हेक्टेयर; उपयुक्तता" },
            dmfEligible: { en: "Orchards / integrated farming", hi: "बागवानी / एकीकृत खेती" },
            parentId: null,
          },
          {
            qid: "N3.2",
            title: { en: "Area under agroforestry/bamboo/medicinal plants/community forest", hi: "एग्रोफॉरेस्ट्री/बांस/औषधीय पौधे/सामुदायिक वन अंतर्गत क्षेत्र" },
            type: "small_matrix",
            uom: { en: "Area (ha) by type", hi: "प्रकारानुसार क्षेत्र (हे)" },
            dmfEligible: { en: "Agroforestry / plantation", hi: "एग्रोफॉरेस्ट्री / रोपण" },
            parentId: null,
            matrixRows: [
              { value: "Agroforestry", label: { en: "Agroforestry", hi: "एग्रोफॉरेस्ट्री" } },
              { value: "Bamboo", label: { en: "Bamboo", hi: "बांस" } },
              { value: "Medicinal", label: { en: "Medicinal plants", hi: "औषधीय पौधे" } },
              { value: "CommunityForest", label: { en: "Community forest", hi: "सामुदायिक वन" } },
            ],
            matrixCols: [
              { value: "type", label: { en: "Type", hi: "प्रकार" } },
              { value: "area", label: { en: "Area (ha)", hi: "क्षेत्र (हे)" }, inputType: "number" },
            ],
          },
          {
            qid: "N3.3",
            title: { en: "Estimated project cost for priority energy/watershed/environmental measure", hi: "प्राथमिक ऊर्जा/जलागम/पर्यावरण उपाय हेतु अनुमानित परियोजना लागत" },
            type: "number",
            uom: { en: "Rs. Lakh", hi: "लाख रुपये" },
            dmfEligible: { en: "DMFT energy & watershed investment", hi: "डीएमएफटी ऊर्जा एवं जलागम निवेश" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "N4. Energy & watershed – gap matrix", hi: "एन4. ऊर्जा एवं जलागम गैप मैट्रिक्स" },
        questions: [
          {
            qid: "N4.1",
            title: { en: "Energy & watershed gap matrix", hi: "ऊर्जा एवं जलागम गैप मैट्रिक्स" },
            type: "matrix",
            uom: { en: "Nos. / Rs. Lakh", hi: "संख्या / लाख रुपये" },
            parentId: null,
            matrixRows: [
              { value: "HHWithoutElectricity", label: { en: "Households without electricity (nos.)", hi: "बिजली रहित परिवार (संख्या)" } },
              { value: "SolarStreetLights", label: { en: "Solar street lights needed (nos.)", hi: "आवश्यक सोलर स्ट्रीट लाइट (संख्या)" } },
              { value: "RechargePits", label: { en: "Percolation tanks / recharge pits", hi: "पर्कोलेशन टैंक / रिचार्ज पिट" } },
              { value: "WatershedArea", label: { en: "Watershed / catchment treatment area (ha)", hi: "जलागम/कैचमेंट उपचार क्षेत्र (हेक्टेयर)" } },
              { value: "OrchardArea", label: { en: "Orchard / agroforestry area (ha)", hi: "बागवानी/एग्रोफॉरेस्ट्री क्षेत्र (हेक्टेयर)" } },
              { value: "RestorationLand", label: { en: "Degraded land for restoration (ha)", hi: "पुनर्स्थापन हेतु क्षतिग्रस्त भूमि (हेक्टेयर)" } },
            ],
            matrixCols: [
                { value: "Existing", label: { en: "Existing", hi: "मौजूदा" } },
                { value: "Functional", label: { en: "Functional", hi: "कार्यात्मक" } },
              { value: "Required", label: { en: "Required", hi: "आवश्यक" } },
           
              { value: "Gap/Shortfall", label: { en: "Gap/Shortfall", hi: "अंतराल/अनुप्रयोग" } },
              { value: "Est. Cost (₹ lakh)", label: { en: "Est. cost (₹ lakh)", hi: "अनुमानित लागत (₹ लाख)" } },
              {
                value: "Scheme Name",
                label: { en: "Scheme Name", hi: "योजना का नाम" },
                inputType: "dropdown",
                dropdownOptions: formSchemeOptions.A,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "O",
    title: { en: "Cross-Sector Baseline Summary & DMFT Investment Estimate", hi: "क्रॉस-सेक्टर बेसलाइन सारांश एवं DMFT निवेश अनुमान" },
    ruleRef: "Cross-sector summary matrix",
    note: {
      en: "Consolidated summary across sectors A–N for priority, gap and investment planning.",
      hi: "सेक्टर A–N के लिए प्राथमिकता, गैप एवं निवेश योजना का समेकित सारांश।",
    },
    order: [
      {
        title: { en: "O1. Development summary", hi: "ओ1. विकास सारांश" },
        questions: [
          {
            qid: "O1",
            title: { en: "Overall development status of the village", hi: "गांव की समग्र विकास स्थिति" },
            type: "options",
            uom: { en: "Status", hi: "स्थिति" },
            options: [
              { value: "Developed", label: { en: "Developed", hi: "विकसित" } },
              { value: "PartiallyDeveloped", label: { en: "Partially Developed", hi: "आंशिक विकसित" } },
              { value: "Underdeveloped", label: { en: "Underdeveloped", hi: "अविकसित" } },
              { value: "CriticalMiningImpact", label: { en: "Critical (mining impact)", hi: "गंभीर (खनन प्रभाव)" } },
            ],
            parentId: null,
          },
          {
            qid: "O2",
            title: { en: "Does Gram Sabha have resolution on development priorities submitted to DMFT?", hi: "क्या ग्रामसभा ने विकास प्राथमिकताओं का संकल्प DMFT को प्रस्तुत किया है?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Date", hi: "हां/नहीं; दिनांक" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Date", hi: "दिनांक" }, detail: { mode: "text", placeholder: "Enter date" } }],
            parentId: null,
          },
          {
            qid: "O3",
            title: { en: "Total estimated DMFT investment needed across all sectors for this village", hi: "गांव हेतु सभी क्षेत्रों में आवश्यक कुल अनुमानित DMFT निवेश" },
            type: "number",
            uom: { en: "Rs. Lakh", hi: "लाख रुपये" },
            dmfEligible: { en: "Total DMFT gap-fill", hi: "कुल डीएमएफटी गैप-फिल" },
            parentId: null,
          },
          {
            qid: "O4",
            title: { en: "Top 3 priority sectors recommended for immediate DMFT funding", hi: "तत्काल DMFT फंडिंग हेतु शीर्ष 3 प्राथमिक सेक्टर" },
            type: "text",
            uom: { en: "Text — 3 sectors", hi: "पाठ — 3 सेक्टर" },
            parentId: null,
          },
          {
            qid: "O5",
            title: { en: "Are there ongoing/pipeline DMFT projects in the village?", hi: "क्या गांव में चालू/पाइपलाइन DMFT परियोजनाएं हैं?" },
            type: "conditional_options",
            uom: { en: "Yes/No; Status and sector", hi: "हां/नहीं; स्थिति और सेक्टर" },
            options: yesNo,
            conditionalRules: [{ triggerValue: "Yes", detailLabel: { en: "Status and sector", hi: "स्थिति और सेक्टर" }, detail: { mode: "text", placeholder: "Enter details" } }],
            parentId: null,
          },
          {
            qid: "O6",
            title: { en: "Convergence opportunities with Central/State schemes for each sector", hi: "प्रत्येक सेक्टर में केंद्र/राज्य योजनाओं के साथ कन्वर्जेन्स अवसर" },
            type: "text",
            uom: { en: "Scheme list by sector", hi: "सेक्टरवार योजना सूची" },
            parentId: null,
          },
          {
            qid: "O7",
            title: { en: "List photographs/documents/maps attached with this survey form", hi: "इस सर्वे फॉर्म के साथ संलग्न फोटो/दस्तावेज़/मानचित्र सूची" },
            type: "text",
            uom: { en: "List", hi: "सूची" },
            parentId: null,
          },
          {
            qid: "O8",
            title: { en: "Any additional observations/special issues noticed by surveyor", hi: "सर्वेक्षक द्वारा देखी गई अतिरिक्त टिप्पणियां/विशेष मुद्दे" },
            type: "text",
            uom: { en: "Text", hi: "पाठ" },
            parentId: null,
          },
        ],
      },
      {
        title: { en: "O2. Cross-sector summary matrix", hi: "ओ2. क्रॉस-सेक्टर सारांश मैट्रिक्स" },
        questions: [
          {
            qid: "O9",
            title: { en: "Cross-sector summary matrix (A–N)", hi: "क्रॉस-सेक्टर सारांश मैट्रिक्स (A–N)" },
            type: "matrix",
            uom: { en: "Priority / Gap / Estimate", hi: "प्राथमिकता / गैप / अनुमान" },
            parentId: null,
            matrixRows: [],
            matrixCols: [
              { value: "Sector", label: { en: "Sectors", hi: "सेक्टर" }, inputType: "text" },
              { value: "SectorActivities", label: { en: "Sector Activities", hi: "सेक्टर गतिविधियां" }, inputType: "text" },
              { value: "KeyGap", label: { en: "Key Gap Identified", hi: "पहचाना गया प्रमुख गैप" }, inputType: "text" },
              { value: "ExistingCoverage", label: { en: "Existing Scheme Coverage", hi: "मौजूदा योजना कवरेज" }, inputType: "text" },
              {
                value: "Priority",
                label: { en: "Priority (H/M/L)", hi: "प्राथमिकता (H/M/L)" },
                inputType: "dropdown",
                dropdownOptions: [
                  { value: "H", label: { en: "H", hi: "उच्च" } },
                  { value: "M", label: { en: "M", hi: "मध्यम" } },
                  { value: "L", label: { en: "L", hi: "निम्न" } },
                ],
              },
              { value: "ResidualGap", label: { en: "Residual Gap for DMFT (Rs. Lakh)", hi: "DMFT हेतु शेष गैप (लाख रुपये)" }, inputType: "number" },
              { value: "Intervention", label: { en: "Recommended Intervention", hi: "अनुशंसित हस्तक्षेप" }, inputType: "text" },
            ],
          },
        ],
      },
    ],
  },

];

// Lookup by code, used by the fill/edit route.
export const getForm = (code: string): FormDef | undefined =>
  FORMS.find((f) => f.code === code);

// Valid codes — backend validates submitted formCode against this set.
export const FORM_CODES = FORMS.map((f) => f.code);