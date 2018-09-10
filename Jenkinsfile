timestamps {

node () {
    deleteDir()
	stage ('wasm - Checkout') {
 	 checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false,
          extensions: [[$class: 'SubmoduleOption',
                        disableSubmodules: false,
                        parentCredentials: false,
                        recursiveSubmodules: true,
                        reference: '',
                        trackingSubmodules: false]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/KnicKnic/WASM-ImageMagick']]]) 
	}
	stage ('wasm - Build') {
 	
// Batch build step
bat """ 
icacls "%CD%" /grant "Everyone":(OI)(CI)F
docker run --rm --workdir /code -v "%CD%":/code wasm-imagemagick-build-tools bash ./build.sh 
 """		
// Batch build step
bat """ 
docker run -v "%CD%":/code --rm --workdir /code node node  /code/tests/rotate/node.js 
 """		
// Batch build step
bat """ 
icacls "%CD%" /grant "Everyone":(OI)(CI)F 
 """
		archiveArtifacts allowEmptyArchive: false, artifacts: 'magick*', caseSensitive: true, defaultExcludes: true, fingerprint: false, onlyIfSuccessful: false 
	}
}
}