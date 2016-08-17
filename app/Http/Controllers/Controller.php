<?php

namespace Dias\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Dias\Http\Middleware\AuthenticateAPI;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * The authenticated user.
     *
     * @var \Dias\User
     */
    protected $user;

    /**
     * The request.
     *
     * @var Request
     */
    protected $request;

    /**
     * Creates a new AdvancedController instance.
     *
     * @param Request $request
     */
    public function __construct(Request $request)
    {
        $this->user = auth()->user();
        $this->request = $request;
    }

    /**
     * Determines if the request was done by an automated script (with API
     * token or ajax).
     *
     * @param Request $request
     * @return bool
     */
    public static function isAutomatedRequest(Request $request)
    {
        return $request->ajax() || $request->wantsJson() || AuthenticateAPI::isApiKeyRequest($request);
    }

    /**
     * Create the response for when a request fails validation.
     * Overrides the default behavior to except passwords in the error response.
     *
     * @param  Request  $request
     * @param  array  $errors
     * @return \Illuminate\Http\Response
     */
    protected function buildFailedValidationResponse(Request $request, array $errors)
    {
        if (static::isAutomatedRequest($request)) {
            return new JsonResponse($errors, 422);
        }

        return redirect()
            ->to($this->getRedirectUrl())
            ->withInput($request->except('password', 'password_confirmation', 'auth_password'))
            ->withErrors($errors);
    }
}
