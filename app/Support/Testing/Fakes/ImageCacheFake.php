<?php

namespace Biigle\Support\Testing\Fakes;

use Biigle\Image;
use Illuminate\Filesystem\Filesystem;
use Biigle\Contracts\ImageCache as ImageCacheContract;

class ImageCacheFake implements ImageCacheContract
{
    public function __construct()
    {
        (new Filesystem)->cleanDirectory(
            $root = storage_path('framework/testing/disks/image-cache')
        );

        $this->path = $root;
    }

    /**
     * {@inheritDoc}
     */
    public function doWith(Image $image, $callback)
    {
        return $callback($image, "{$this->path}/{$image->id}");
    }

    /**
     * {@inheritDoc}
     */
    public function doWithOnce(Image $image, $callback)
    {
        return $this->doWith($image, $callback);
    }

    /**
     * {@inheritDoc}
     */
    public function getStream(Image $image)
    {
        return [
            'stream' => null,
            'size' => 0,
            'mime' => 'inode/x-empty',
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function clean()
    {
        //
    }
}
