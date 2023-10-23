import { PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import TButton from "../components/core/TButton";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios";

export default function Surveys() {
  // const {surveys} = useStateContext();
  const [surveys, setSurveys] = useState([]);
  console.log(surveys);

  const onDeleteClick = () => {
    console.log("On Delete click")
  };

  useEffect(() => {
    axiosClient.get('/survey')
      .then(({data}) => {
        setSurveys(data.data)
      });
  }, []);

  return (
    <PageComponent title="Survey"
      buttons={(
        <TButton color="green" to="/surveys/create">
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          <span className="pt-0.5">New Survey</span>
        </TButton>
      )}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {surveys.map(survey => (
            <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick} />
          ))}
      </div>
        
      </PageComponent>
    // <>
    //         <header className="bg-grbodydark border-b-2 border-grbtnred shadow">
    //             <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    //               <h1 className="text-3xl font-bold tracking-widest text-white">Surveys</h1>
    //             </div>
    //         </header>
    //         <main>
    //           <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
    //                   Survey Content  
    //           </div>
    //         </main>
    //     </>
  )
}

