<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Models\SurveyQuestion;
use App\Enums\QuestionTypeEnum;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rules\Enum;
use App\Http\Resources\SurveyResource;
use App\Http\Requests\StoreSurveyRequest;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UpdateSurveyRequest;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SurveyResource::collection(
            Survey::where('user_id', $user->id)
                ->orderBy('created_at'. 'desc')
                ->paginate(10)
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();
        //return $data;

        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
        }

        $survey = Survey::create($data);

        //This will create new questions
        foreach($data['questions'] as $question) {
            $question['survey_id'] =  $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        //check if the user have the permission to read that specific survey
        if($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action!');
        }
        return new SurveyResource($survey);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Survey $survey)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @param \App\Http\Requests\UpdateSurveyRequest $request
     * @param \App\Models\Survey $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        //get the validated data
        $data = $request->validated();

        //check if iamge if was given and save in local file
        if(isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            //if an old image exist, delete it
            if($survey->image) {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }

        //Update the survey in the database
        $survey->update($data);

        //Get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();
        //Get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'], 'id');

        //Find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        //Find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        //Delete questions wqhich is in toDelete array
        SurveyQuestion::destroy($toDelete);

        //Create new questions
        foreach($data['questions'] as $question) {
            if(in_array($question['id'], $toAdd)){ //check if the question in $data['questions'] are in $toAdd
                $question['survey_id'] = survey->id;
                $this->createQuestion($question);
            }
        }

        //Update existing questions
        $questionMap = collect($data['questions'])->keyBy('id'); //get the questions and convert it to a collection and  i index it by id.
        foreach($survey->questions as $question) { //iterating to all the database questions
            if(isset($questionMap[$question->id])) { //check if the db question id exist inside the questionMap
                $this->updateQuestion($question, $questionMap[$question->id]); //call the update question method: $question-database model, $questionMap[$question->id] - the questions coming from the browser
            }
        }

        return new SurveyResource($survey);
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param \App\Models\Survey $suvey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $survey->delete();

        //if old image exist, delete it
        if($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }
        return response('', 204);
    }


    /**
    * Save image in local file system and return save image path
    * 
    * @param $image
    * @throws \Exception
    * @author RD Vincent Gaspar <rdvincentgaspar@gmail.com>
    */

    private function saveImage($image)
    {
        //this will check if the image is a valid base64 string
        if(preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            //take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            //get the file extension
            $type = strtolower($type[1]); //jpg, png etc

            //check if the file is in the valid type extension of an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('Invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            //check if the decoding happened
            if($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match URL wuth image data');
        }
        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if(!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        } 
        file_put_contents($relativePath, $image);

        return $relativePath;
    }


    /**
    * Create a question
    * 
    * @param $data
    *@return mixed
    * @throws \Illuminate\Validation\ValidationException
    * @author RD Vincent Gaspar <rdvincentgaspar@gmail.com>
    */

    private function createQuestion($data) //$data - this is the data of questions while ['data'] are the options(radiobutton etc)
    {
        if(is_array($data['data'])) {  //check if the given data inside $data is an array
            $data['data'] = json_encode($data['data']); //encode the data and save it as a string back to $data['data']
        }
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)
        ],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    /**
     * Update a question and return true or false
     * 
     * @param \App\Models\SurveyQuestion $question
     * @param----------------------------$data
     * @return bool
     * @throws \Illuminate\Validation\ValidationException
     * @author RD Vincent Gaspar <rdvincentgaspar@gmail.com>
    */
    private function updateQuestion(SurveyQuestion $question, $data) 
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }

}


