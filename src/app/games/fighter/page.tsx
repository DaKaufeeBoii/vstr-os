import { redirect } from "next/navigation";

// Fighter Arena has been removed. Redirect to main OS.
export default function FighterPage() {
  redirect("/");
}
