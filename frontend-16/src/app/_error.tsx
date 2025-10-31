export default function ErrorPage() {
  return <pre>Encountered an error!</pre>
}

export async function getServerSideProps() {
  return { props: {} }
}