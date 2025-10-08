# Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Deployment

- [ ] Supabase project created
- [ ] Database tables created (donations, bikes, work_orders)
- [ ] RLS policies configured
- [ ] Test user created in Supabase Authentication
- [ ] Supabase URL and anon key copied

## Local Testing

- [ ] Code runs locally
- [ ] Can open login modal
- [ ] Supabase connection works (check browser console)
- [ ] No console errors
- [ ] All links work

## Git Repository

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` file present
- [ ] No sensitive data in repository
- [ ] README.md included

## Netlify Configuration

- [ ] Site connected to Git repository (or uploaded)
- [ ] Environment variables added:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
- [ ] Site deployed successfully
- [ ] No build errors in deploy logs

## Post-Deployment Testing

- [ ] Site loads at Netlify URL
- [ ] Click "Login" button - modal opens
- [ ] Try logging in with test credentials
- [ ] Check browser console for errors
- [ ] Test Netlify function: `https://your-site.netlify.app/.netlify/functions/config`
- [ ] Mobile responsive check

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Netlify)
- [ ] Form submissions working
- [ ] Analytics added (Netlify Analytics or Google Analytics)
- [ ] Error monitoring set up (Sentry, LogRocket, etc.)

## Security Review

- [ ] Environment variables not exposed in client code
- [ ] RLS policies active on all tables
- [ ] Only anon key used (not service role key)
- [ ] HTTPS enabled
- [ ] Security headers configured

## Documentation

- [ ] README.md updated with project-specific details
- [ ] Team members have access to Supabase dashboard
- [ ] Team members have access to Netlify dashboard
- [ ] Admin credentials stored securely

## Troubleshooting Quick Checks

If something doesn't work:

1. **Check Browser Console** (F12)
   - Look for red error messages
   - Check if Supabase client initialized

2. **Check Netlify Deploy Logs**
   - Go to Deploys in Netlify dashboard
   - Click on latest deploy
   - Read deploy log for errors

3. **Check Netlify Function Logs**
   - Go to Functions in Netlify dashboard
   - Click on function name
   - Check recent invocations

4. **Verify Environment Variables**
   - Site settings > Environment variables
   - Make sure values are correct
   - Redeploy after any changes

5. **Check Supabase Logs**
   - Go to Supabase dashboard
   - Logs & Reports section
   - Look for failed queries

## Common Issues

### Issue: Login doesn't work
**Solution:** Verify user exists in Supabase > Authentication > Users

### Issue: "Supabase not configured" error
**Solution:** Check environment variables are set and redeploy

### Issue: Database queries fail
**Solution:** Check RLS policies allow the operation

### Issue: 404 on function endpoint
**Solution:** Verify `netlify.toml` has `functions = "netlify/functions"`

### Issue: Changes don't appear
**Solution:** Hard refresh (Ctrl+Shift+R) or clear cache and redeploy

## Support Contacts

- Supabase Support: [https://supabase.com/support](https://supabase.com/support)
- Netlify Support: [https://www.netlify.com/support/](https://www.netlify.com/support/)
- Project Repository Issues: (add your GitHub issues link here)

---

**Last Updated:** October 8, 2025
**Deployment Date:** _____________
**Deployed By:** _____________
