using TextFileEditor.Services;
using Xunit;

namespace TextFileEditor.Tests.Services;

public class TextProcessorTests
{
    private const string Input =
        @"2025-06-09T09:25:09+00:00	containers.upgrade-service.log	{""stream"":""stdout"",""docker"":{""container_id"":""001a42f2e3a92e8885abddf7719c91f8fa63db88d1bc4f05c05481cfd65eb52d""},""kubernetes"":{""container_name"":""upgrade-service"",""namespace_name"":""default"",""pod_name"":""upgrade-service-85994d4db-7j9b6"",""container_image"":""zartifactory.zerto.local:8443/zvm-docker-registry/release/z10_u8/upgrade-service:10.0.80.8857"",""container_image_id"":""sha256:d6edc41c19cbb6fce3192de6f1b4deb1487cd58a0b0a5496a0125ed225635fcb"",""pod_id"":""5be2c24e-6a6e-4bf9-bfb7-55afafb5cc2e"",""pod_ip"":""10.217.32.59"",""host"":""debian""},""message"":""   at UpgradeService.Managers.Managers.UpgradeManager.UpgradeAsyncImpl(IZProgress progress, IUpgradeTaskMetadataWriter writer, UpgradeParameters upgradeParameters) in /src/dev/tools/Production/Upgrade/UpgradeService/UpgradeService.Managers/Managers/UpgradeManager.cs:line 133"",""utc_time_stamp"":""2025-06-09T09:25:09+0000""}";

    private const string Expected =
        @"   at UpgradeService.Managers.Managers.UpgradeManager.UpgradeAsyncImpl(IZProgress progress, IUpgradeTaskMetadataWriter writer, UpgradeParameters upgradeParameters) in /src/dev/tools/Production/Upgrade/UpgradeService/UpgradeService.Managers/Managers/UpgradeManager.cs:line 133";

    [Fact]
    public void PadsAsExpected()
    {
        // Act & Assert
        string fromProcessor = TextProcessor.PadLines(Input);
        Assert.Equal(Expected, fromProcessor);
    }
}