<?php namespace Dias\Http\Controllers\Api;

use Dias\Http\Controllers\Controller;
use Dias\Shape;

class ShapeController extends Controller {

	/**
	 * Shows all shapes.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Shape::all();
	}

	/**
	 * Displays the specified shape.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Shape::find($id);
	}
}