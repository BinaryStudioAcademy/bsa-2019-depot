import React from 'react';
import { NavLink } from 'react-router-dom';

const NOTES = {
    name: (
        <div>Your name may appear around Depot where you contribute or are mentioned. You can remove it at any time.</div>
    ),
    email: (
        <div>
      You have set your email address to private. To toggle email privacy, go to email settings and uncheck "Keep my
      email address private."
        </div>
    ),
    bio: (
        <div>
      You can @<strong>mention</strong> other users and organizations to link to them.
        </div>
    ),
    company: (
        <div>
      You can @<strong>mention</strong> your company’s Depot organization to link it.
        </div>
    ),
    disclaimer: (
        <div>
      All of the fields on this page are optional and can be deleted at any time, and by filling them out, you're giving
      us consent to share this data wherever your user profile appears. Please see our{' '}
            <NavLink to="/">privacy statement</NavLink> to learn more about how we use this information.
        </div>
    )
};

export default NOTES;
