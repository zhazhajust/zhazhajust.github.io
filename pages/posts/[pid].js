import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
//import { getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
//import javascript from "highlight.js/lib/languages/javascript";
//import cpp from "highlight.js/lib/languages/cpp";
//import python from "highlight.js/lib/languages/python";
import { useEffect } from "react";

export default function Post({ postData }) {
  useEffect(() => {
    hljs.registerLanguage('cpp',          require('highlight.js/lib/languages/cpp'));
    hljs.registerLanguage('python',       require('highlight.js/lib/languages/python'));
    hljs.highlightAll();
  });
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  var paths = getAllPostIds();
  console.log(paths)
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  //const postData = await getPostData(params.id)
  //const router = useRouter()
  //const { id } = router.query
  console.log(`Params: ${params}`)
  const postData = await getPostData(params.pid)
  return {
    props: {
      postData
    }
  }
}
