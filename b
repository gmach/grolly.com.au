rm -rf build     
yarn build
tar cvf build.tar build/.
scpf build.tar
rm build.tar
