import { PageHeader } from '../../../../components/ui/PageHeader';
import { AiCopilotConsole } from '../../../../components/ai/AiCopilotConsole';

export default function AiCopilotPage() {
  return <>
    <PageHeader title="SDI One AI Copilot" description="Ask operational questions against SDI's imported business data. The copilot is ready for live OpenAI integration and includes local deterministic intelligence as a safe fallback." />
    <AiCopilotConsole />
  </>;
}
