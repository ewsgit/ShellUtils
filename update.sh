echo "This script requires sudo privileges. Please enter your password when required to continue."
sudo -i
echo Updating Github Cli...
sudo apt update
sudo apt install gh -y
echo Updating ShellUtils...
cp ~/.ShellUtils/* ~/.ShellUtils-old/
rm -rf ~/.ShellUtils/
gh repo clone ewsgit/ShellUtils ~/.ShellUtils/
cp ~/.ShellUtils-old/settings.json ~/.ShellUtils/settings.json
cp ~/.ShellUtils-old/scripts/* ~/.ShellUtils/scripts/
cp ~/.ShellUtils-old/dotfileconf.json ~/.ShellUtils/dotfileconf.json
cd ~/.ShellUtils/
npm install
npm install -g
echo ""
echo "ShellUtils update complete, enjoy!"