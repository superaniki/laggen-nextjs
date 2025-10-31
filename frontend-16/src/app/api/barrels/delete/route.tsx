import { deleteBarrel } from "@/actions"
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request, res: Response, context: {}) {
  console.log("Hej DELETE")
  try {
    const body: any = await req.json()
    
    if (!body.id) {
      return Response.json({ 
        success: false, 
        message: "Missing barrel ID" 
      }, { status: 400 })
    }
    
    // Call the server action to delete the barrel
    await deleteBarrel(body.id);
    
    // Revalidate the home page to update the barrel list
    revalidatePath('/');
    
    return Response.json({ 
      success: true, 
      message: "Barrel deleted successfully" 
    }, { status: 200 })
  } catch (e) {
    console.log('Error occurred trying to delete barrel');
    console.log(e);

    // Return a more detailed error response
    return Response.json({ 
      success: false, 
      message: "Failed to delete barrel",
      error: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 })
  }
}