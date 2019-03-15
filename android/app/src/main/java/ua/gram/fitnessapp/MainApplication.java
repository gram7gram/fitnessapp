package ua.gram.fitnessapp;

import android.app.Application;

import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import com.rnfs.RNFSPackage;

import com.wix.reactnativeuilib.highlighterview.HighlighterViewPackage;
import com.wix.reactnativeuilib.textinput.TextInputDelKeyHandlerPackage;
import com.wix.reactnativeuilib.wheelpicker.WheelPickerPackage;

public class MainApplication extends NavigationApplication {

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            new HighlighterViewPackage(),
            new TextInputDelKeyHandlerPackage(),
            new WheelPickerPackage(),
            new RNFSPackage(),
            new SvgPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}