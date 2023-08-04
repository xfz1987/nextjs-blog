import { useRouter } from 'next/router';

const PortfolioProjectPage = () => {
  // pathname: "/portfolio/[projectid]"
  // query: {projectid: 'xxx'}
  const { query: { projectid } } = useRouter();

  // you can send a request to some backend server to fetch the piece of data with an id of projectid

  return (
    <div>
      <h1>Project Page - {projectid}</h1>
    </div>
  )
}

export default PortfolioProjectPage;