<?php

$router->group([
    'middleware' => 'auth',
    'namespace' => 'Views',
    ], function ($router) {
        $router->get('videos/{id}', 'VideoController@show')->name('video');
        $router->get('videos/create', 'VideoController@store')->name('create-video');
    });

$router->group([
    'middleware' => 'auth:web,api',
    'namespace' => 'Api',
    'prefix' => 'api/v1',
    ], function ($router) {
        $router->resource('projects.videos', 'ProjectVideoController', [
            'only' => ['store'],
            'parameters' => ['projects' => 'id'],
        ]);

        $router->get('videos/{id}/file', 'VideoFileController@show');

        $router->resource('videos.annotations', 'VideoAnnotationController', [
            'only' => ['index', 'store'],
            'parameters' => ['videos' => 'id'],
        ]);

        $router->resource('video-annotations', 'VideoAnnotationController', [
            'only' => ['update', 'destroy'],
            'parameters' => ['video-annotations' => 'id'],
        ]);
    });
