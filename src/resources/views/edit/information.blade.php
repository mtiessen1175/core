<div class="panel panel-default">
    <div class="panel-heading">
        Volume information
    </div>
    <div class="panel-body">
        @if (session('saved'))
            <div class="alert alert-success" role="alert">
                The volume information was successfully updated.
            </div>
        @endif
        <form role="form" method="POST" action="{{ url('api/v1/volumes/'.$volume->id) }}">
            <div class="row">
                <div class="form-group col-sm-6{{ $errors->has('name') ? ' has-error' : '' }}">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" name="name" id="name" value="{{ old('name', $volume->name) }}" placeholder="My volume" required>
                    @if($errors->has('name'))
                        <span class="help-block">{{ $errors->first('name') }}</span>
                    @endif
                </div>
                <div class="form-group col-sm-6{{ $errors->has('media_type_id') ? ' has-error' : '' }}">
                    <label for="media_type_id">Media type</label>
                    <select class="form-control" name="media_type_id" id="media_type_id" required>
                        @foreach($mediaTypes as $mediaType)
                            <option {!! old('media_type_id', $volume->media_type_id) == $mediaType->id ? 'selected="selected"' : '' !!} value="{{ $mediaType->id }}">{{ trans('biigle.media_types.'.$mediaType->name) }}</option>
                        @endforeach
                    </select>
                    @if($errors->has('media_type_id'))
                        <span class="help-block">{{ $errors->first('media_type_id') }}</span>
                    @endif
                </div>
            </div>
            <div class="row">
                <div class="form-group col-xs-12{{ $errors->has('url') ? ' has-error' : '' }}">
                    <label for="url">URL</label>
                    <input type="text" class="form-control" name="url" id="url" value="{{ old('url', $volume->url) }}" placeholder="/vol/images/volume" required>
                    <p class="help-block">
                        The directory containing the volume images. Can be local like <code>/vol/images/volume</code> or remote like <code>https://my-domain.tld/volume</code>.
                    </p>
                    @if($errors->has('url'))
                        <span class="help-block">{{ $errors->first('url') }}</span>
                    @endif
                </div>
            </div>
            <input type="hidden" name="_token" value="{{ csrf_token() }}">
            <input type="hidden" name="_method" value="PUT">
            <input type="hidden" name="_redirect" value="{{ route('volume-edit', $volume->id) }}">
            <input type="submit" class="btn btn-success" value="Save">
        </form>
    </div>
</div>
