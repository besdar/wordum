FROM mcr.microsoft.com/devcontainers/base:bookworm

RUN apt-get update
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
RUN unzip commandlinetools-linux-11076708_latest.zip
RUN mv cmdline-tools /usr/local/android-sdk
RUN rm commandlinetools-linux-11076708_latest.zip
RUN apt-get install -y openjdk-17-jdk
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV ANDROID_HOME=/usr/local/android-sdk
RUN yes | /usr/local/android-sdk/bin/sdkmanager --licenses --sdk_root=/usr/local/android-sdk
RUN /usr/local/android-sdk/bin/sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" "build-tools;34.0.0" "ndk;26.1.10909125" "cmake;3.22.1" --sdk_root=/usr/local/android-sdk