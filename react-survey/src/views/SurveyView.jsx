
import { useEffect, useState } from 'react'
import PageComponent from '../components/PageComponent'
import { PhotoIcon } from '@heroicons/react/24/outline';
import  TButton  from "../components/core/TButton";
import axiosClient from '../axios.js';
import { useNavigate, useParams } from 'react-router-dom';
import SurveyQuestions from '../components/SurveyQuestions';
import { DotSpinner } from '@uiball/loaders'
import { useStateContext } from '../contexts/ContextProvider';
import {v4 as uuidv4} from "uuid";

export default function SurveyView() {
    const { showToast } = useStateContext();
    const navigate = useNavigate();
    const {id} = useParams()

    const [survey, setSurvey] = useState({
        title: "",
        slug: "",
        status: false,
        description: "",
        image: null,
        image_url: null,
        expire_date: "",
        questions: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [errors, setErrors] = useState({
    //     title: '',
    //     description: '',
    //     expire_date: '',
    // });

    const onImageChoose = (ev) => {
        // console.log("On Image Choose")
        const file = ev.target.files[0];

        const reader = new FileReader();

        reader.onload = () => {
            setSurvey({
                ...survey,
                image: file,
                image_url: reader.result
            });

            ev.target.value = ""
        }

        reader.readAsDataURL(file);

    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        
        const payload = {...survey};
        if(payload.image){
            payload.image = payload.image_url;
        }
        delete payload.image_url;
        let res = null;
        if(id){
            res = axiosClient.put(`/survey/${id}`, payload)
        } else {
            res = axiosClient.post('/survey', payload)
        }
        
        res.then((res) => {
            console.log(res);
            navigate('/surveys');
            if (id) {
                showToast('Survey successfully updated!')
            } else {
                showToast('Survey successfully created!')
            }
            
        })
        .catch((err) => {
            // if (err && err.response) {
            //     const errorData = err.response.data;
            //     if (errorData.field) {
            //         setErrors({ ...errors, [errorData.field]: errorData.message });
            //     }
            //     console.log(err, err.response);
            // }
            if(err && err.response) {
                setError(err.response.data.message);
            }
            console.log(err, err.response);
        });
        // axiosClient.post('/survey', {
        //     title: 'Lorem Ipsum',
        //     description: 'est',
        //     expire_date: '2023-11-22',
        //     status: true,
        //     questions: []
        // })
    }

    function onQuestionsUpdate(questions) {
        setSurvey({
            ...survey,
            questions
        })
    }

    const addQuestion = () => {
        survey.questions.push({
            id: uuidv4(),
            type: "text",
            question: "",
            description: "",
            data: [],
        })
        setSurvey({...survey})
    }

    useEffect(() => {
        if(id) {
            setLoading(true)
            axiosClient.get(`/survey/${id}`)
            .then (({data}) => {
                setSurvey(data.data)
                setLoading(false)
            })
        }
    }, [])

  return (
    <PageComponent title={!id ? 'Create new Survey' : 'Update Survey'}>
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
        {!loading &&
            <form action="#" method='POST' onSubmit={onSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">

               

                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">

                    {error && (
                        <div className='bg-red-500 text-white py-2 px-3 rounded-sm'>
                            {error}
                        </div>
                    )}

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Photo
                        </label>
                        <div className="mt-1 flex items-center">
                            {survey.image_url && (
                                <img 
                                    src={survey.image_url} 
                                    alt="" 
                                    className='w-32 h-32 object-cover' 
                                />
                            )}
                            {!survey.image_url && (
                                <span className="flex justify-center items-center text-gray-400 h-12 w-12 
                                overflow-hidden rounded-full bg-gray-100">
                                    <PhotoIcon className='w-8 h-8' />
                                </span>
                            )}
                            <button
                                type='button'
                                className='relative ml-5 rounded-md border border-gray-300 bg-white py-2
                                px-3 text-sm font-medium leading-4 text-gray-800 shadow-sm hover:bg-gray-50
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                    <input type="file"
                                        className='absolute left-0 top-0 bottom-0 opacity-0'
                                        onChange={onImageChoose}
                                    />
                                    Change
                                </button>
                        </div>
                    </div>
                    {/* Image */}

                    {/* title */}
                    <div className="col-span-6 sm:col-span-3">
                        <label 
                            htmlFor="title" 
                            className='block text-sm font-medium text-gray-700'>
                                Survey Title
                        </label>
                        <input 
                            type="text" 
                            name='title'
                            id='title'
                            value={survey.title}
                            onChange={(ev) => 
                                setSurvey({ ...survey, title: ev.target.value })
                            }
                            placeholder='Survey Title'
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grbtnred
                            focus:ring-grbtnred sm:text-sm'
                        />
                    </div>
                    {/* {errors.title && (
                        <small className='text-red-500'>{errors.title}</small>
                    )} */}
                    
                    {/* title */}

                    {/* Description */}
                    <div className="col-span-6 sm:col-span-3">
                            <label 
                                htmlFor="description"
                                className='block text-sm font-medium text-gray-700'
                            >
                                Description
                            </label>
                            <textarea 
                                name="description" 
                                id="description" 
                                value={survey.description}
                                onChange={(ev) =>
                                    setSurvey({ ...survey, description: ev.target.value })
                                }
                                placeholder='Describe your survey'
                                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grbtnred
                                focus:ring-grbtnred sm:text-sm'
                            >
                            </textarea>
                    </div>
                    {/* Description */}

                    {/* Expire Date */}
                    <div className="clo-span-6 sm:col-span-3">
                        <label 
                            htmlFor="expire_date"
                            className='block text-sm font-medium text-gray-700'
                        >
                            Expire Date
                        </label>
                        <input 
                            type="date"
                            name='expire_date'
                            id='expire_date'
                            value={survey.expire_date}
                            onChange={(ev) =>
                                setSurvey({ ...survey, expire_date: ev.target.value })
                            }
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grbtnred
                            focus:ring-grbtnred sm:text-sm'
                        />
                    </div>
                    {/* Expire Date */}

                    {/* Active */}
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input 
                                type="checkbox"
                                id='status'
                                name='status' 
                                checked={survey.status}
                                onChange={(ev) =>
                                    setSurvey({...survey, status: ev.target.checked})
                                }
                                className='h-4 w-4 rounded border-gray-300 text-grbodydark focus:ring-grbtnred'
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="comments" className="font-medium text-gray-700">
                                Active
                            </label>
                            <p className="text-gray-500">
                                Whether to make survey publicly available
                            </p>
                        </div>
                    </div>
                    {/* Active */}

                    <SurveyQuestions questions={survey.questions} onQuestionsUpdate={onQuestionsUpdate} />

                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <TButton>
                        Save 
                    </TButton>
                </div>
            </div>
            </form>
        }
    </PageComponent>
  )
}
