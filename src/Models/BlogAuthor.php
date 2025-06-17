<?php

namespace NSanden\LaravelInertiaReactBlog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class BlogAuthor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'user_id',
        'avatar_url',
    ];

    public function posts()
    {
        return $this->hasMany(BlogPost::class, 'author_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function findOrCreateForUser(User $user, $title = 'Author')
    {
        $author = static::where('user_id', $user->id)->first();
        
        if (!$author) {
            $author = static::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'title' => $title,
            ]);
        }
        
        return $author;
    }
}