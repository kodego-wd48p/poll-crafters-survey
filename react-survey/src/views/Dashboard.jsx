import PageComponent from "../components/PageComponent";
import DashboardCard from "../components/DashboardCard";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import { EyeIcon,PencilIcon } from "@heroicons/react/24/outline";
import { DotSpinner } from '@uiball/loaders';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/dashboard`)
    .then((res) => {
      setLoading(false);
      setData(res.data);
      return res;
    })
    .catch((error) => {
      setLoading(false);
      return error;
    })
  },[])

    return (
      <PageComponent title="Dashboard">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-100">
            <DashboardCard 
              title="Total Surveys"
              className=" order-3 lg:order-3"
              style={{animationDelay: '0.7s'}}
            >
              <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                {data.totalSurveys}
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Total Answers"
              className=" order-4 lg:order-4"
              style={{animationDelay: '0.9s'}}
            >
              <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                {data.totalAnswers}
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Latest Survey"
              className=" order-1 lg:order-1 row-span-2"
              style={{animationDelay: '0.3s'}}
            >
              {data.latestSurveys && (
                <div>
                  <img 
                    src={data.latestSurveys.image_url} 
                    className="w-[240px] mx-auto"
                  />
                  <h3 className="font-bold text-xl mb-3">
                    {data.latestSurveys.title}
                  </h3>
                  <div className="flex justify-between text-sm mb-1">
                    <div>Create Date:</div>
                    <div>{data.latestSurveys.created_at}</div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>Expire Date:</div>
                    <div>{data.latestSurveys.expire_date}</div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>Status:</div>
                    <div>{data.latestSurveys.status ? "Active" : "Draft"}</div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>Questions:</div>
                    <div>{data.latestSurveys.questions}</div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <div>Answers:</div>
                    <div>{data.latestSurveys.answers}</div>
                  </div>
                  <div className="flex justify-between">
                    <TButton to={`/surveys/${data.latestSurveys.id}`} link>
                      <PencilIcon className="w-5 h-5 mr-2 text-emerald-400 ">
                        
                      </PencilIcon>
                      <p className="text-emerald-400 ">Edit Survey</p>
                    </TButton>

                    <TButton link>
                      <EyeIcon className="w-5 h-5 mr-2 text-emerald-400 ">
                      
                      </EyeIcon>
                      <p className="text-emerald-400 ">View Answers</p>
                    </TButton>
                  </div>
                </div>
              )}
              {!data.latestSurveys && (
                <div className="text-gray-100 text-center py-16">
                  You don't have any surveys yet
                </div>
              )}
            </DashboardCard>
            
            <DashboardCard 
              title="Latest Answers"
              className=" order-2 lg:order-2 row-span-2"
              style={{animationDelay: '0.5s'}}
            >
              {data.latestAnswers.length && (
                <div className="text-left">
                    {data.latestAnswers.map((answer) => (
                      <a 
                        href="#"
                        key={answer.id}
                        className="block p-2 hover:text-emerald-300"
                      >
                          <div className="font-semibold">{answer.survey.title}</div>
                          <small>
                            Answer Made at:
                            <i className="font-semibold"> {answer.end_date}</i>
                          </small>
                      </a>
                    ))}
                </div>
              )}
              {!data.latestAnswers.length &&
                <div className="text-gray-600 text-center py-16">
                  You don't have answers yet
                </div>
              }
            </DashboardCard>
        </div>
      )}

      </PageComponent>
        // <>
        //     <header className="bg-grbodydark border-b-2 border-grbtnred shadow">
        //         <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        //           <h1 className="text-3xl font-bold tracking-widest text-white">Dashboard</h1>
        //         </div>
        //     </header>
        //     <main>
        //       <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        //             Dashboard Content   
        //       </div>
        //     </main>
        // </>
    )
}