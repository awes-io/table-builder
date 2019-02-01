<?php

namespace AwesIO\TableBuilder;

use AwesIO\BaseJS\AwesProvider;

class TableBuilderServiceProvider extends AwesProvider
{

    public function getPackageName(): string
    {
        return 'table-builder';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}
