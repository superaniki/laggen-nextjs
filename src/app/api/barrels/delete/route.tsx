import { deleteBarrel } from "@/actions"

export async function DELETE(req: Request, res: Response, context: {}) {
  console.log("Hej DELETE")
  try {
    const body: any = await req.json()
    const response = await deleteBarrel(body.id);

    return Response.json({ success: true }, { status: 200 })
  } catch (e) {
    console.log('Error occurred trying to delete Work Places');
    console.log(e);

    return Response.json({ success: false }, { status: 500 })
  }
}