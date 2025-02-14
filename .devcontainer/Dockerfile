FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt-get update
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
RUN mkdir -p /usr/local/android-sdk/cmdline-tools/latest
RUN unzip commandlinetools-linux-11076708_latest.zip -d /usr/local/android-sdk/cmdline-tools/latest
RUN mv /usr/local/android-sdk/cmdline-tools/latest/cmdline-tools/* /usr/local/android-sdk/cmdline-tools/latest/
RUN rm commandlinetools-linux-11076708_latest.zip
RUN apt-get install -y openjdk-17-jdk
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV ANDROID_HOME=/usr/local/android-sdk
ENV PATH=$PATH:/usr/local/android-sdk/platform-tools
ENV PATH=$PATH:/usr/local/android-sdk/cmdline-tools/latest/bin
RUN yes | sdkmanager --licenses
RUN chown -R $USER:$USER /usr/local/android-sdk
RUN chmod -R 777 /usr/local/android-sdk
