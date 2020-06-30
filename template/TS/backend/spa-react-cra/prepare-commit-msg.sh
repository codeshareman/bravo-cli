#!/bin/sh
ORIG_MSG_FILE=$1
TEMP=.git/temp
BRANCH_PATH=$(git symbolic-ref -q HEAD) #Somthing like refs/heads/myBranchName
BRANCH_NAME=${BRANCH_PATH##*/}      #Get text behind the last / of the branch path

echo $ORIG_MSG_FILE
branch_err_msg()
{
    echo "Invalid branch name: ${BRANCH_NAME}"
    echo "Branch format is: {TYPE}-{NO.}-{SUBJECT}"
    echo "example:"
    echo "  1. story-1014668-for-testing"
    echo "  2. task-1014668-for-testing"
    echo "  3. bug-1014668-for-testing"
    exit 1
}
need_config()
{
    echo "Need add tadp config in user section"
    echo "Please use 'git config --global -e' to command to add it"
    exit 1
}
ELEMENTS=(${BRANCH_NAME//-/ })
if [ ${#ELEMENTS} -lt 2 ]
then
    branch_err_msg
fi
TICKET_TYPE=${ELEMENTS[0]}
if [ $TICKET_TYPE != 'story' ] && [ $TICKET_TYPE != 'task' ] && [ $TICKET_TYPE != 'bug' ]
then
    branch_err_msg
fi
TICKET_NO=${ELEMENTS[1]}
re='^[0-9]+$'
if ! [[ $TICKET_NO =~ $re ]]
then
    branch_err_msg
fi
TAPD_USER=$(git config user.tapd)
if [ -z "$TAPD_USER" ]
then
  need_config
fi
echo " " >> $ORIG_MSG_FILE
echo "--$TICKET_TYPE=$TICKET_NO --user=$TAPD_USER $ORIG_MSG" >> $ORIG_MSG_FILE