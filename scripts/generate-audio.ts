import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is missing.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

interface AudioScenario {
  id: string;
  category: string;
  filename: string;
  voiceName: string;
  transcript: string;
}

const scenarios: AudioScenario[] = [
  {
    id: 'insurance-calm-female-01',
    category: 'insurance',
    filename: 'insurance-calm-female-01.mp3',
    voiceName: 'Aoede', // Female, calm, steady
    transcript:
      'Hello, my name is Eleanor Vance, and I am calling to check on the status of my auto insurance claim. The claim reference number is CL-88429, filed under policy number PA-40912. I had a minor fender bender last Thursday, and I wanted to verify whether my five hundred dollar deductible applies before I authorize the repair shop to proceed with the bumper replacement. Could you please check if the adjuster has reviewed the inspection photos?'
  },
  {
    id: 'insurance-concerned-male-01',
    category: 'insurance',
    filename: 'insurance-concerned-male-01.mp3',
    voiceName: 'Puck', // Male, concerned, natural
    transcript:
      "Hi there, my name is David Miller. I'm calling about my homeowners policy, number HO-77319. We had a sudden pipe burst in our upstairs bathroom yesterday morning, and there is water leaking down through the ceiling into our kitchen. I've already turned off the main water valve and hired an emergency drying crew, but I need to make sure this mitigation work is covered under our emergency repairs clause. What paperwork does the restoration contractor need to submit directly to you?"
  },
  {
    id: 'insurance-angry-demand-male-01',
    category: 'insurance',
    filename: 'insurance-angry-demand-male-01.mp3',
    voiceName: 'Puck', // Male, angry, confrontational
    transcript:
      "Listen to me very carefully, because I am sick and tired of being bounced around your automated system! My name is Arthur Pendelton, policy number PA-99341, claim number CL-12094. You people denied my basement water mitigation claim for twelve thousand dollars, claiming it was surface runoff rather than pipe backup! That is complete nonsense! I have paid premiums for fourteen years, and I demand you reverse this denial right now. And do not put me on hold again with someone overseas—I want to speak with a senior supervisor located here in your domestic claims office immediately!"
  },
  {
    id: 'ticketing-energetic-male-01',
    category: 'ticketing',
    filename: 'ticketing-energetic-male-01.mp3',
    voiceName: 'Puck', // Male, fast, energetic
    transcript:
      "Hey, good morning! My name is Jordan Brooks, and I'm super excited because I just bought four weekend passes for the Horizon Summer Music Festival next month! My confirmation code is TK-93021. The purchase went through on my credit card for eight hundred and forty dollars, but the PDF bar codes haven't hit my email inbox yet. Can you please verify my email address and resend the digital pass link to my mobile wallet?"
  },
  {
    id: 'ticketing-frustrated-female-01',
    category: 'ticketing',
    filename: 'ticketing-frustrated-female-01.mp3',
    voiceName: 'Kore', // Female, urgent, assertive
    transcript:
      "Hello, this is Patricia Hayes. I'm calling because the evening show is tomorrow night at eight, and I still have not received my reserved orchestra tickets. My reservation number is EV-51870 under Patricia Hayes. I was billed three hundred and twenty dollars two weeks ago, and your automated system told me they would be delivered electronically within twenty-four hours. I really need you to reissue these tickets right now or arrange for box office will-call pickup so we don't get turned away at the door."
  },
  {
    id: 'ticketing-discriminatory-female-01',
    category: 'ticketing',
    filename: 'ticketing-discriminatory-female-01.mp3',
    voiceName: 'Aoede', // Female, entitled, impatient
    transcript:
      "Excuse me! I don't have time for this script you're reading. My name is Brenda Sterling, order reference TK-88102. I paid twenty-four hundred dollars for four front-row VIP gala passes for this Saturday, and I just got an email saying our seats were shifted back to general floor seating! No way, that is completely unacceptable! And honestly, I can barely understand what you are saying. I don't want an overseas call center rep—transfer me right now to a representative located in the United States who speaks native English and has the authority to restore my front-row seats!"
  },
  {
    id: 'ecommerce-friendly-female-01',
    category: 'ecommerce',
    filename: 'ecommerce-friendly-female-01.mp3',
    voiceName: 'Aoede', // Female, friendly, conversational
    transcript:
      'Hi, good afternoon! My name is Sarah Jenkins. I ordered an espresso maker last Monday, and the order number is EC-44182. The tracking notification said it was out for delivery by four o\'clock today, but the courier van just drove past without stopping. I just wanted to verify if it was rescheduled for tomorrow or if the driver might still come back before seven this evening. Thank you so much for checking on this for me!'
  },
  {
    id: 'ecommerce-impatient-male-01',
    category: 'ecommerce',
    filename: 'ecommerce-impatient-male-01.mp3',
    voiceName: 'Puck', // Male, impatient, direct
    transcript:
      'Hi, listen, my name is Marcus Reid. I received order number OR-62095 earlier today, which was supposed to be a thirty-two inch gaming monitor, but the shipping box was crushed and the screen panel is completely cracked. I need to start a return and get a replacement unit expedited immediately, because I need this display for my work tomorrow. Can you email me a prepaid return shipping label and confirm that my replacement won\'t be delayed until the broken one gets back to your warehouse?'
  },
  {
    id: 'ecommerce-furious-male-01',
    category: 'ecommerce',
    filename: 'ecommerce-furious-male-01.mp3',
    voiceName: 'Puck', // Male, hostile, threatening
    transcript:
      "Are you people running a scam over there? My name is Donald Vance, order number OR-77401! I bought a designer cashmere winter coat for eighteen hundred and fifty dollars, tracking number EC-99230. Your system says it was delivered yesterday afternoon, but my security cameras show no delivery driver ever stepped on my property! Don't you dare tell me to wait five business days for a courier investigation! I want a full refund processed back to my credit card within the next ten minutes, or I am filing a fraud claim with my bank and reporting you to the attorney general!"
  }
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateSingle(scenario: AudioScenario): Promise<boolean> {
  const dir = path.join(process.cwd(), 'public', 'audio', scenario.category);
  fs.mkdirSync(dir, { recursive: true });
  const finalMp3Path = path.join(dir, scenario.filename);

  if (fs.existsSync(finalMp3Path) && fs.statSync(finalMp3Path).size > 1000) {
    console.log(`[SKIP] ${scenario.filename} already exists (${fs.statSync(finalMp3Path).size} bytes).`);
    return false;
  }

  const tempWavPath = path.join(dir, `${scenario.id}.wav`);
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Generating audio for ${scenario.id} with voice ${scenario.voiceName} (attempt ${attempts})...`);
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: scenario.transcript,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: scenario.voiceName
                }
              }
            }
          }
        });
      } catch (firstErr: any) {
        console.warn(`gemini-3.8-flash-tts failed, trying gemini-3.1-flash-tts-preview:`, firstErr.message || firstErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: scenario.transcript,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: scenario.voiceName
                }
              }
            }
          }
        });
      }

      const audioPart = response.candidates?.[0]?.content?.parts?.[0];
      const base64Data = audioPart?.inlineData?.data;
      if (!base64Data) {
        throw new Error('No audio data returned in response');
      }

      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(tempWavPath, buffer);
      console.log(`Saved temporary WAV: ${tempWavPath} (${buffer.length} bytes)`);

      // Convert to MP3 using ffmpeg
      execSync(`ffmpeg -y -i "${tempWavPath}" -codec:a libmp3lame -qscale:a 2 "${finalMp3Path}"`, {
        stdio: 'inherit'
      });

      // Cleanup wav
      if (fs.existsSync(tempWavPath)) {
        fs.unlinkSync(tempWavPath);
      }

      console.log(`Successfully generated MP3: ${finalMp3Path} (${fs.statSync(finalMp3Path).size} bytes)`);
      return true;
    } catch (err: any) {
      console.error(`Attempt ${attempts} failed:`, err.message || err);
      if (attempts >= maxAttempts) {
        throw err;
      }
      const waitTime = 25000;
      console.log(`Waiting ${waitTime / 1000}s before retry...`);
      await sleep(waitTime);
    }
  }
  return false;
}

async function main() {
  console.log('Starting audio generation for new difficult & de-escalation scenarios...');
  for (let i = 0; i < scenarios.length; i++) {
    const generated = await generateSingle(scenarios[i]);
    if (generated && i < scenarios.length - 1) {
      console.log('Pacing 22s between requests to respect rate limits...');
      await sleep(22000);
    }
  }
  console.log('All audio generation completed!');
}

main().catch((err) => {
  console.error('Audio generation failed:', err);
  process.exit(1);
});
