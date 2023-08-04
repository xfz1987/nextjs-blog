// http://localhost:3000/clients/a/b
import { useRouter } from "next/router";

const SelectedClientProjectsPage = () => {
  const { query: { id, clientprojectid } } = useRouter();
  console.log(id, clientprojectid);

  return (
    <div>
      <h1>The Project Page for a Specific Project for a Selected Client </h1>
    </div>
  )
}

export default SelectedClientProjectsPage;