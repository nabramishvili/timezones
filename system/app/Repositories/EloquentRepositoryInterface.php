<?php

namespace App\Repositories;


use Illuminate\Database\Eloquent\Model;

/**
 * Interface EloquentRepositoryInterface
 * @package App\Repository
 */
interface EloquentRepositoryInterface
{

    /**
     * @param $id
     * @return Model
     */
    public function find($id);

}


