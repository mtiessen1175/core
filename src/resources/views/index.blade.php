@extends('app')

@section('title') Annotate @stop

@section('scripts')
<script src="{{ asset('vendor/annotations/scripts/ol-debug.js') }}"></script>
<script src="{{ asset('vendor/annotations/scripts/main.js') }}"></script>
@append

@section('styles')
<link href="{{ asset('vendor/annotations/styles/ol.css') }}" rel="stylesheet">
<link href="{{ asset('vendor/annotations/styles/main.css') }}" rel="stylesheet">
@append

@section('content')
<div class="annotator__container" data-ng-app="dias.annotations" data-ng-controller="AnnotatorController" data-image-id="{{ $image->id }}" data-transect-id="{{ $image->transect->id }}">
	<div id="canvas" class="annotator__canvas" data-ng-controller="CanvasController">
	</div>
	<div class="annotator__sidebar">
		@include('annotations::index.sidebar')
	</div>
</div>
@endsection
