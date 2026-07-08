git reset HEAD~1
rm ./backport.sh
git cherry-pick 206ba7ee998e003ffdf79f03675e02720f3868e2
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
