import { redirect } from "next/navigation";
import './styles.css'

export default async function HomePage() {
  redirect("/home")
}
