<?php

declare (strict_types=1);
namespace PhpParser\Node\Expr\Cast;

use PhpParser\Node\Expr\Cast;
class Bool_ extends \PhpParser\Node\Expr\Cast
{
    public function getType() : string
    {
        return 'Expr_Cast_Bool';
    }
}
