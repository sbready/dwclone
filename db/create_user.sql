insert into users( name_first, name_last, email, gender, auth_id )
    values( $1, $2, $3, $4, $5 ) 
    returning*;