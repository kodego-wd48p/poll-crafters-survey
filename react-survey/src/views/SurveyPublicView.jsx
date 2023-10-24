import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axiosClient from "../axios";

export default function SurveyPublicView() {
    const [survey, setSurvey] =useState({});
    const { slug } = useParams();

    useEffect(() => {
        axiosClient.get(`survey.get-by-sluf/${slug}`)
        .then(({data}) => {
            setSurvey(data);
        })
    }, [])

  return (
    <div>
        <pre className="text-white">
            {JSON.stringify(survey, undefined, 2)}
        </pre>
    </div>
  )
}
