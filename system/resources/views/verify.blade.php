@component('mail::message')
    # Hello {{$user->full_name}}

    Please verify your email using this link:

    @if(config('app.env')==='production')
        {{str_replace( 'http://', 'https://', route('verify', $user->email_verify_token) )}}
    @else
        {{route('verify', $user->email_verify_token)}}
    @endif
@endcomponent
