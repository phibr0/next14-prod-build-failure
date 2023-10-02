import { WorkflowClient } from '@temporalio/client';
import { OneClickBuy } from '../../temporal/lib/workflows';

export async function POST(req: Request) {
  const { itemId } = await req.json();
  const client = new WorkflowClient();
  const handle = await client.start(OneClickBuy, {
    workflowId: `business-meaningful-id-${new Date().getTime()}`,
    taskQueue: 'tutorial',
    args: [itemId],
  });

  return Response.json({ workflowId: handle.workflowId });
}
