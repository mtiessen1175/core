<?php

namespace Biigle\Http\Requests;

use Biigle\Shape;
use Biigle\Video;
use Illuminate\Foundation\Http\FormRequest;

class StoreVideoAnnotation extends FormRequest
{
    /**
     * The video on which the annotation should be created.
     *
     * @var Video
     */
    public $video;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->video = Video::findOrFail($this->route('id'));

        return $this->user()->can('add-annotation', $this->video);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'label_id' => 'required|id|exists:labels,id',
            'shape_id' => 'required|id|exists:shapes,id',
            'points' => [
                'required_unless:shape_id,'.Shape::wholeFrameId(),
                'array',
            ],
            'frames' => 'required|array',
            'frames.*' => 'required|numeric|min:0|max:'.$this->video->duration,
            'track' => 'filled|boolean',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $frameCount = count($this->input('frames', []));

            if ($this->input('shape_id') === Shape::wholeFrameId() && $frameCount > 2) {
                $validator->errors()->add('frames', 'A new whole frame annotation must not have more than two frames.');
            }

            if ($this->shouldTrack()) {
                if ($frameCount !== 1) {
                    $validator->errors()->add('id', 'Only single frame annotations can be tracked.');
                }

                if (count($this->input('points', [])) !== 1) {
                    $validator->errors()->add('id', 'Only single frame annotations can be tracked.');
                }

                $allowedShapes = [
                    Shape::pointId(),
                    Shape::circleId(),
                ];

                if (!in_array(intval($this->input('shape_id')), $allowedShapes)) {
                    $validator->errors()->add('id', 'Only point and circle annotations can be tracked.');
                }
            }
        });
    }

    /**
     * Determine if the new annotation should be tracked.
     *
     * @return bool
     */
    public function shouldTrack()
    {
        return boolval($this->input('track', false));
    }
}
