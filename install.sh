echo "This script requires sudo privileges. Please enter your password when required to continue."
echo "Installing ShellUtils..."
mkdir ~/.ShellUtils/
cp ./* ~/.ShellUtils/
cd ~/.ShellUtils/
rm settings.json
rm dotfileconf.json
npm install
npm install -g
echo "Installing Github CLI..."
sudo apt update
sudo apt install gh -y
echo ""
echo "ShellUtils installed"
echo "use \"s help\" to see all commands. Hope you enjoy :)"