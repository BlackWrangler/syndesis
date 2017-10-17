# syndesis
A flexible, customizable, open source platform that provides core integration capabilities as a service.

Currently this repo just pulls in all the other syndesis project repos as submodules, to clone it locally run:

git clone --recursive https://github.com/syndesisio/syndesis.git

## building everything

    ./build.sh
    
To see all the available options:

    ./build.sh --help
    
### resumme from module    
To resume from a particular module:

    ./build.sh --resume-from ui
    
### using the image streams    
To build everything using image streams (instead of directly talking to docker):

    ./build.sh --with-image-streams
    
Note that this assumes that you are using a template flavor that also supports image streams.
