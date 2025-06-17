<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('blog_authors', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->after('title');
        });
    }

    public function down()
    {
        Schema::table('blog_authors', function (Blueprint $table) {
            $table->dropColumn('avatar_url');
        });
    }
};