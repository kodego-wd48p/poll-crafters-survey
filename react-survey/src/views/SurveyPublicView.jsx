import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import PublicQuestionView from "../components/PublicQuestionView";
import { DotSpinner } from "@uiball/loaders";

export default function SurveyPublicView() {
  const answers = {};
  const [surveyFinished, setSurveyFinished] = useState(false);
  const [survey, setSurvey] = useState({
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`survey/get-by-slug/${slug}`)
      .then(({ data }) => {
        setLoading(false);
        setSurvey(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  function answerChanged(question, value) {
    answers[question.id] = value;
    console.log(question, value);
  }

  function onSubmit(ev) {
    ev.preventDefault();

    console.log(answers);
    axiosClient
      .post(`/survey/${survey.id}/answer`, {
        answers,
      })
      .then((response) => {
        debugger;
        setSurveyFinished(true);
      });
  }

  return (
    <div>
      {loading &&
                <div className="flex h-screen items-center justify-center">
                  {/* <h3 className="text-white text-xl">Loading...</h3> */}
                    <DotSpinner
                     size={70}
                     speed={0.9} 
                     color="white" 
                    />
                </div>
            }
      {!loading && (
        <form onSubmit={(ev) => onSubmit(ev)} className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <div className="mb-4 sm:mb-0 sm:mr-4 h-auto">
                <img src={survey.image_url} alt="" className="h-full w-full object-cover" />
              </div>
                
              <div className="col-span-1 sm:col-span-5">
                <h1 className="text-3xl mb-3 text-white">{survey.title}</h1>
                <p className="text-gray-200 text-sm mb-3">
                  Expire Date: {survey.expire_date}
                </p>
                <p className="text-gray-200 text-sm mb-3">{survey.description}</p>
              </div>
            </div>


          {surveyFinished && (
            <div className="py-8 px-6 mt-12 bg-emerald-500 text-white text-center text-xl w-full mx-auto sm:text-5xl">
              Thank you for participating in the survey
            </div>
          )}
          {!surveyFinished && (
            <>
              <div className="bg-white mt-4 mb-2 pt-4 rounded-md">
                {survey.questions.map((question, index) => (
                  <PublicQuestionView
                    key={question.id}
                    question={question}
                    index={index}
                    answerChanged={(val) => answerChanged(question, val)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grbtnred"
              >
                Submit
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}