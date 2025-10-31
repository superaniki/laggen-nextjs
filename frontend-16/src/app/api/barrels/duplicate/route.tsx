import { duplicateBarrel } from "@/actions"

export async function POST(req: Request, res: Response, context: {}) {
  console.log("Hej Duplicate")
  try {
    const body: any = await req.json()
    const response = await duplicateBarrel(body.id);

    return Response.json({ success: true }, { status: 200 })
  } catch (e) {
    console.log('Error occurred trying to duplicate Barrel');
    console.log(e);

    return Response.json({ success: false }, { status: 500 })
  }
}