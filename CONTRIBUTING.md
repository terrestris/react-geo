# Contributing

Thank you for contributing to our project! We are happy for any kind of contribution
and welcome anyone who is interested in doing so. Please also have a look at our [code of conduct](./CODE_OF_CONDUCT.md).

## Contributions other than code

There is more than one way of contributing. If you have questions, topics to discuss or anything else
that is related to the react-geo project, feel free to open an issue - we have created some issue templates to help you
with that. If your issue addresses a general topic or if you are unsure where to open it, this repository is the right
one to choose.

## Reporting issues and suggesting features

To report an issue or to suggest features or a change, [open an issue](https://github.com/terrestris/react-geo/issues/new/choose)
on GitHub.

## Changing code and documentation

This guide covers contributing to the main version of react-geo source code which is the `main` branch. It assumes that you
have some very basic knowledge of Git and GitHub, but if you don't just go through some tutorial online.

### First time setup

* Create an account on GitHub.
* Install Git on your computer.
* Set up Git with your name and email.
* Fork the repository.
* Clone your fork (use SSH or HTTPS URL):

```
git clone git@github.com:your_GH_account/react-geo.git
```

* Enter the directory

```
cd react-geo/
```

* Add main react-geo repository as "upstream" (use HTTPS URL):

```
git remote add upstream https://github.com/terrestris/react-geo
```

* Your remotes now should be `origin` which is your fork and `upstream` which
  is this main react-geo repository. You can confirm that using:

```
git remote -v
```

* You should see something like:

```
origin	git@github.com:your_GH_account/react-geo.git (fetch)
origin	git@github.com:your_GH_account/react-geo.git (push)
upstream	https://github.com/terrestris/react-geo.git (fetch)
upstream	https://github.com/terrestris/react-geo.git (push)
```

It is important that `origin` points to your fork.

### Update before creating a branch

* Make sure you are using the `main` branch:

```
git checkout main
```

* Download updates from all branches from all remotes:

```
git fetch upstream
```

* Update your local `main` branch to match `main` in the main repository:

```
git rebase upstream/main
```

### Update if you have local branches

If `rebase` fails with "error: cannot rebase: You have unstaged changes...",
then move your uncommitted local changes to "stash" using:

```
git stash
```

* Now you can rebase:

```
git rebase upstream/main
```

* Apply your local changes on top:

```
git stash apply
```

* Remove the stash record (optional):

```
git stash pop
```

### Creating a branch

Now you have updated your local main branch, you can create a branch based on it.

* Create a branch and switch to it:

```
git checkout -b new-feature
```

### Making changes

You can use your favorite tools to change source code or other files in the local copy of the code.

### Committing

* Add files to the commit (changed ones or new ones):

```
git add file1
git add file2
```

* Commit the change:

```
git commit -m "Added a new feature"
```

### Injecting a development version into another project

`npm run watch:buildto` can be used to inject an updated version of `react-geo` into antother project. The script will also watch for further changes. Example usage:

```sh
npm run watch:buildto ../<YOUR_PROJECT>/node_modules/@terrestris/react-geo
```

### Pushing changes to GitHub

* Push your local branch to your fork:

```
git push origin new-feature
```

### Pull request

When you push, GitHub will respond back in the command line to tell you what URL to use to create a pull request.
You can follow that URL or you can go any time later to your fork on GitHub, display the branch `new-feature`, and
GitHub will show you a button to create a pull request.

### After creating a pull request

react-geo maintainers will now review your pull request. If needed, the maintainers will work with you to improve
your changes.

Once the changes in the pull request are ready to be accepted, the maintainers will decide if it is more appropriate to:

* Merge your branch,
* Squash all commit into one commit, or
* Rebase (i.e., replay) all commits on top of the main branch.

### Legalese

Committers are the front line gatekeepers to keep the code base clear of improperly contributed code. It is important
to the react-geo users, developers and the community to avoid contributing any code to the project without it being
clearly licensed under the project license.

Generally speaking the key issues are that those providing code to be included in the repository understand that the
code will be released under the BSD-2-Clause license, and that the person providing the code has the
right to contribute the code. For the committer themselves understanding about the license is hopefully clear. For
other contributors, the committer should verify the understanding unless the committer is very comfortable that
the contributor understands the license (for instance frequent contributors).

If the contribution was developed on behalf of an employer (on work time, as part of a work project or similar) then
it is important that an appropriate representative of the employer understand that the code will be contributed under
the BSD-2-Clause license. The arrangement should be cleared with an authorized supervisor/manager, etc.

The code should be developed by the contributor, or the code should be from a source which can be rightfully contributed
such as from the public domain, or from an open source project under a compatible license.

All unusual situations need to be discussed and/or documented.

Committer should adhere to the following guidelines, and may be personally legally liable for improperly contributing
code to the source repository:

* Make sure the contributor (and possibly employer) is aware of the contribution terms.
* Code coming from a source other than the contributor (such as adapted from another project) should be clearly marked
  as to the original source, copyright holders, license terms and so forth. This information can be in the file
  headers, but should also be added to the project licensing file if not exactly matching normal project licensing
  (LICENSE).
* Existing copyright headers and license text should never be stripped from a file. If a copyright holder wishes to
  give up copyright they must do so in writing to the project core team via info@terrestris.de before copyright
  messages are removed. If license terms are changed it has to be by agreement (written in email is ok) of the
  copyright holders.
* When substantial contributions are added to a file (such as substantial patches) the author/contributor should be
  added to the list of copyright holders for the file.
* If there is uncertainty about whether a change is proper to contribute to the code base, please seek more information
  from the project core team.
