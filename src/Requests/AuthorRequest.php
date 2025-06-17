<?php

namespace NSanden\LaravelInertiaReactBlog\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthorRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        $authorId = $this->route('author') ? $this->route('author')->id : null;

        return [
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id|unique:blog_authors,user_id,' . $authorId,
            'avatar_url' => 'nullable|url|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The author name is required.',
            'name.max' => 'The author name must not exceed 255 characters.',
            'title.required' => 'The author title is required.',
            'title.max' => 'The author title must not exceed 255 characters.',
            'user_id.exists' => 'The selected user does not exist.',
            'user_id.unique' => 'This user is already linked to another author.',
            'avatar_url.url' => 'The avatar URL must be a valid URL.',
            'avatar_url.max' => 'The avatar URL must not exceed 2048 characters.',
        ];
    }
}