# Zeka Stack 业务工程规范

适用版本：当前仓库 3.0.0-SNAPSHOT。维护日期：2026-10-23。

这份文档约束 AI 使用 Zeka Stack 开发业务项目时的工程结构与代码写法。先读取业务项目自己的 `AGENTS.md`、POM、现有同类实现，再读取本规范和已选 starter 的 Skill。项目明确约定优先；遇到冲突说明证据，不静默拼接两套风格。

## 1. 开发顺序与完成条件

1. 确认需求、数据库、Web 类型、事务边界、错误码和已有业务模块。
2. 查询已有封装和公开方法签名，再选择 starter；不得根据类名猜测 API。
3. 确定 PO / Form / Query / DTO 和映射规则，再实现 DAO / Service / Controller。
4. 用构造器注入依赖，复用统一响应、断言异常和持久层基类。
5. 检查参数校验、授权、分页上限、排序白名单、事务、日志脱敏和返回字段。
6. 执行项目允许的编译与测试；说明实际验证范围。未运行的命令不能写成已通过。

新类和关键方法需要注释，解释业务约束和这样写的原因。生成器产生的 `autoField`、TODO、示例表名、占位字段必须按实际表结构清理。

## 2. 依赖与技术栈

业务项目使用 `dev.dong4j:arco-business-parent`；通过 `dev.dong4j:cubo-boot-dependencies` BOM 管理版本。已有 parent/BOM 时先检查，不随意覆盖。下面的版本对应本仓库快照，使用其他版本时必须核对该版本的 API。

```xml
<parent>
    <groupId>dev.dong4j</groupId>
    <artifactId>arco-business-parent</artifactId>
    <version>3.0.0-SNAPSHOT</version>
    <relativePath/>
</parent>
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>dev.dong4j</groupId>
            <artifactId>cubo-boot-dependencies</artifactId>
            <version>3.0.0-SNAPSHOT</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
<dependencies>
    <dependency>
        <groupId>dev.dong4j</groupId>
        <artifactId>cubo-ssm-spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```

| 场景 | 选择 | 边界 |
| --- | --- | --- |
| 标准 Servlet + MyBatis 业务服务 | `cubo-ssm-spring-boot-starter` | 已含 framework、Servlet REST、Knife4j、Servlet endpoint、MyBatis、Actuator |
| 只需启动与日志 | `cubo-framework-spring-boot-starter` | 已含 launcher 与 Log4j2 |
| 按需组装 Servlet API | `cubo-rest-servlet-spring-boot-starter` | 使用本文 Servlet 范式 |
| WebFlux | `cubo-rest-reactive-spring-boot-starter` | 不套用 ServletController、Servlet 响应包装和过滤器示例 |
| 字典 | `cubo-dict-spring-boot-starter` | 基于 MyBatis 和 Servlet；准备真实字典表 |
| Kafka / RocketMQ | 对应 messaging starter | 按实际中间件选，不为了“兼容”同时引入 |
| Dubbo 文档 | `cubo-openapi-dubbo-spring-boot-starter` | 当前还引入 Servlet endpoint；纯 Reactive 项目先检查传递依赖 |

`cubo-rest-spring-boot-starter` 等 packaging 为 `pom` 的聚合模块不是业务项目的 JAR 入口。不要重复引入已由组合 starter 提供的基础设施。不要同时引入 Servlet 和 Reactive starter，也不要在 Reactive 事件循环中执行阻塞 MyBatis 调用。

Java 版本跟随业务项目 `.tool-versions` 和 parent；本仓库使用 Java 17。使用项目 Maven Wrapper，不任意切换 JDK 或依赖版本。

## 3. 启动与扫描范围

```java
package dev.dong4j.zeka.demo;

import dev.dong4j.zeka.starter.launcher.ZekaStarter;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** 使用框架统一生命周期，避免另建启动链。 */
@SpringBootApplication
public class DemoApplication extends ZekaStarter {
}
```

默认继承入口，不额外生成 `main()`。需要显式入口的既有项目先保留其约定。非 Web 服务通过 `@RunningType(ApplicationType.SERVICE)` 声明；生命周期扩展使用 `before()`、`run(String... args)`、`after()`。

**包名是运行条件。** Launcher 的扫描前缀来自 `ConfigDefaultValue.BASE_PACKAGES`，默认 `dev.dong4j.zeka`。其他根包必须在 JVM 启动前设置 `-DPARENT_PACKAGE_NAME=com.example`，并确认 Spring 的组件与 Mapper 扫描覆盖业务模块。它是 JVM 系统属性，不是随意添加到 YAML 的配置项。

Servlet `RestUtils.zekaClass()` 通过包名包含 `App.BASE_PACKAGES` 或框架根包判断是否包装响应。业务 Controller 在其他包下时，未正确配置前缀会失去自动包装；要为实际包名做接口集成验证。Maven 打包入口还依赖父构建链生成的 `start.class`，不要手写未经验证的打包参数。

## 4. 包结构与职责

```text
dev.dong4j.zeka.demo
├── DemoApplication.java
└── account
    ├── controller/AccountController.java
    ├── service/AccountService.java
    ├── service/impl/AccountServiceImpl.java
    ├── dao/AccountMapper.java
    ├── entity/po/Account.java
    ├── entity/dto/AccountDTO.java
    ├── entity/form/AccountForm.java
    ├── entity/form/AccountQuery.java
    ├── entity/converter/AccountConverter.java
    └── enums/AccountCodes.java
src/main/resources/mappers/AccountMapper.xml
```

按业务模块聚合代码。Controller 接收和校验请求、调用 Service、返回 DTO；Service 处理业务约束、事务和转换；DAO 访问数据库。禁止 Controller 直接操作 Mapper，禁止将数据库 PO 作为公开接口的输入输出。

简单 CRUD 可按生成器让 Service 接受 Form / Query，并立即转换为 PO 或查询条件；复杂业务先映射成明确的命令或领域模型，不把 HTTP、ServletRequest 或框架分页细节传播到所有层。不要为每个简单 CRUD 强行引入额外的领域抽象。

## 5. Servlet Controller 与统一响应

使用 `dev.dong4j.zeka.starter.rest.annotation.RestControllerWrapper`，继承 `dev.dong4j.zeka.starter.rest.ServletController`。前者组合 `@RestController`、`@ResponseWrapper`、`@RequestMapping`。

```java
@Tag(name = "账户接口")
@AllArgsConstructor
@RestControllerWrapper("/accounts")
public class AccountController extends ServletController {
    private final AccountService accountService;

    /** 只暴露经过字段筛选的 DTO，内部 PO 留在持久层。 */
    @GetMapping("/{id}")
    @Operation(summary = "账户详情")
    public AccountDTO detail(@PathVariable Long id) {
        return this.accountService.detail(id);
    }

    /** 参数格式交给校验框架，业务校验交给 Service。 */
    @PostMapping
    @Operation(summary = "创建账户")
    public void create(@Validated @RequestBody AccountForm form) {
        this.accountService.create(form);
    }
}
```

此片段省略 import；`zeka demo` 提供独立文件和完整 import 的业务范例。

直接返回 DTO、集合、`IPage<DTO>` 或 `void`；Servlet Advice 自动包装为 `Result<T>`。已有代码显式使用 `R.succeed()` / `R.failed()` 或 `this.ok()` 时保持一致，Advice 不会重复包装已是 `Result` 的对象。下载、流输出和第三方协议接口使用 `@OriginalResponse` 并做集成验证。

`Result<T>` 提供 code、success、data、message、traceId、extend 等字段；实际 JSON 字段是否出现还受空值序列化与环境影响。默认成功码是 2000，不是 HTTP 状态码 200。错误返回使用 `BaseCodes` 或业务错误枚举；不要另建 `ApiResponse`，不要 `try/catch` 后返回错误 Map。

使用 OpenAPI 的 `@Tag`、`@Operation`、`@Schema`，Query 使用 `@ParameterObject`。更新时校验路径 ID 与 Form ID 一致，并启用需要的 `UpdateGroup` 与 `Default` 校验组。

## 6. 业务异常与错误码

```java
package dev.dong4j.zeka.demo.account.enums;

import dev.dong4j.zeka.kernel.common.assertion.LowestExceptionAssert;
import lombok.AllArgsConstructor;
import lombok.Getter;

/** 稳定的业务错误码，供统一异常处理器翻译为接口响应。 */
@Getter
@AllArgsConstructor
public enum AccountCodes implements LowestExceptionAssert {
    ACCOUNT_NOT_FOUND(4201, "账户不存在");

    private final Integer code;
    private final String message;
}
```

调用 `AccountCodes.ACCOUNT_NOT_FOUND.notNull(account)`；通用约束使用 `BaseCodes.PARAM_VERIFY_ERROR.isTrue(...)`、`BaseCodes.DATA_ERROR.notNull(...)`、`BaseCodes.OPTION_FAILURE.isTrue(...)`。根据含义选择 `notBlank`、`notEmpty`、`fail` 等已有断言；它们创建 `LowestException`，统一交由异常处理器。

业务错误码应遵循项目已分配区间，示例 4201 不代表框架预留。错误码参数用于消息格式化，不把隐私、凭据或 SQL 直接暴露给用户。捕获异常只用于能恢复的情况或补充上下文，保留因果链；不要全局吞异常、重复打印或把失败伪装为成功。

## 7. MyBatis 持久层

| 层 | 推荐类型 | 用法 |
| --- | --- | --- |
| DAO | `dev.dong4j.zeka.starter.mybatis.base.BaseDao<PO>` | 继承增强 CRUD；使用 `@Mapper` 或项目已有 MapperScan |
| Service 接口 | `dev.dong4j.zeka.starter.mybatis.service.BaseService<PO>` | 加入实际业务方法 |
| Service 实现 | `dev.dong4j.zeka.starter.mybatis.service.impl.BaseServiceImpl<Mapper, PO>` | 复用 baseMapper 和框架查询能力 |
| 仅主键 PO | `BasePO<Long, Account>` | 只有 id，不凭空添加表不存在的字段 |
| 带时间 PO | `BaseWithTimePO<Long, Account>` | id、createTime、updateTime；**不含 deleted** |
| 带逻辑删除 PO | `BaseWithLogicPO<Long, Account>` | id、deleted；不含时间 |
| 时间与逻辑删除 | `BaseExtendPO<Long, Account>` | id、时间、deleted |

实体基类位于 `dev.dong4j.zeka.starter.mybatis.base`。表结构必须包含基类对应列；不要让 AI 为表不存在的列选择过大的基类。PO 不使用 `@SuperBuilder`，其基类没有对应构建链；使用无参构造与链式 setter。Form / DTO / Query 的基类支持 `@SuperBuilder`。

PO 使用 `@TableName`、明确的 `@TableField`、`@EqualsAndHashCode(callSuper = true)` 和必要的列常量。不要在子类重复定义 id、createTime、updateTime 或 deleted。时间填充来自 `TimeMetaObjectHandler`；主键策略和逻辑删除配置必须核对当前数据库与 MyBatis 配置。

多步写操作在 Service 的 public 方法上使用 `@Transactional(rollbackFor = Exception.class)`；确认代理调用、数据库约束与回滚行为。参考模板中的 `insertIgnore()` 是 MySQL 风格的增强，不是所有新增操作都应该忽略冲突；普通新增选择 `insert()`，需要忽略冲突时明确返回语义。

分页 Query 继承 `BaseQuery<Long>`，已有 page、limit、ascs、descs、startTime、endTime、deleted。限制 page/limit，并将外部排序字段映射到服务端白名单；不要直接将用户输入拼入 SQL。自定义 XML 放 `mappers/`，namespace 与 DAO 全限定名一致，参数绑定使用 `#{...}`。只有含逻辑删除列的表才使用 deleted 条件。

## 8. 输入、输出、对象转换与校验

- Form：`dev.dong4j.zeka.kernel.common.base.BaseForm<Long>`；接收入参，字段使用 Jakarta Validation 注解。
- DTO：`dev.dong4j.zeka.kernel.common.base.BaseDTO<Long>`；作为 Service 与 Controller 的数据契约，避免把 PO 或敏感字段直接输出。
- Query：`dev.dong4j.zeka.kernel.common.base.BaseQuery<Long>`；扩展实际查询条件，移除生成器占位字段。
- Converter：MapStruct `@Mapper` + `dev.dong4j.zeka.kernel.common.mapstruct.ExtendConverter<Form, DTO, PO>`；使用 `f2p`、`p2d`、`d2p`。旧 `po` / `dto` 方法已废弃，不再生成。
- 创建与更新约束不同，使用 `dev.dong4j.zeka.kernel.validation.group.CreateGroup` / `UpdateGroup`，并同时考虑 `jakarta.validation.groups.Default`。不要只写分组注解却遗漏对应 `@Validated` 分组。
- 可复用校验注解位于 `dev.dong4j.zeka.kernel.validation`，例如 Phone、IdCard、IPAddress、Json；使用前查询确切包名、参数和适用类型，不编造正则或注解。

新增字段同时检查请求、数据库、转换和响应；敏感字段明确排除，不能因为自动映射成功就认为可以公开。

## 9. 枚举、日志与测试

业务值枚举实现 `dev.dong4j.zeka.kernel.common.enums.SerializeEnum<Integer>`，提供 value / desc，使用构造器与 getter。JSON 输出受 REST 的枚举序列化配置影响，修改前先验证客户端协议；不要为相同状态重复建多个不一致的数值定义。

使用 SLF4J / `@Slf4j` 参数化日志，日志由 Log4j2 starter 统一配置；不使用 `System.out`、不打印完整请求凭据。复用框架 Trace / traceId，不另建线程上下文；线程池与异步消息场景要验证上下文传播。脱敏展示和数据库加密是不同能力，分别核对对应注解、拦截器与密钥配置。

项目测试优先按既有 `@ZekaTest` 约定；Web 测试按需加入 MockMvc 配置。数据库读写、自动包装、校验组、错误码和事务回滚需要真实集成测试；静态 lint 只能提示常见问题，不能替代编译或运行。

## 10. 优先复用的工具与组件

以下常用工具位于 `dev.dong4j.zeka.kernel.common.util`，调用前用 `zeka search <类名或关键词>` 核对签名与来源；索引中的测试类、内部实现不是业务可依赖 API。

| 需求 | 先检查的封装 | 选择原则 |
| --- | --- | --- |
| 字符串、集合、对象 | `StringUtils`、`CollectionUtils`、`ObjectUtils` | 避免再建同名 Utils 或手写重复判空 |
| 日期与时间 | `DateUtils`、`DateTimeUtils` | 先确认时区、类型和格式契约 |
| JSON | `Jsons`、`GsonUtils` | 保持项目序列化栈一致，核对 API，避免新建 ObjectMapper |
| 类型与枚举转换 | `EnumUtils`、MapStruct `ExtendConverter` | 结构转换优先显式映射，控制敏感字段 |
| Bean 转换 | `BeanUtils` | 只用于明确适用的动态场景，不替代有业务约束的 Converter |
| 异常、延迟初始化 | `Exceptions`、`Try`、`Unchecked`、`Lazy`、`Holder` | 不借封装吞掉异常或隐藏副作用 |
| 分布式 ID | `SnowflakeBuilder` | 先确认项目 ID 与节点策略 |
| 网络与运行环境 | `NetUtils`、`HostUtils`、`ConfigKit` | 区分本地与部署环境，不在业务中硬编码 |
| 密码学 | `AesUtils`、`DigestUtils`、`Base64Utils` | 编码不等于加密，密钥来自受控配置 |
| 并发 | `ThreadUtils`、`TimeoutUtils` | 明确线程池归属、超时和资源释放 |
| 字典 | `DictionaryService` | 复用 `getDictionaryOptions(typeCode)`，不要重复造字典查询 |
| 消息 | `MessagingTemplate` + `UnifiedMessage` | `sendSync` / `sendAsync` / `sendOneWay`；按业务保障幂等与失败处理 |

REST 的 TokenRequired、CurrentUser、ApiVersion、RequestSingleParam、FormDataBody、RequestAbstractForm 等属于能力选项；先核对对应 starter 与认证上下文，不能把注解当成完整授权策略。

## 11. 配置与扩展边界

配置以源码 `@ConfigurationProperties` 和自动配置条件为准，前缀为 `zeka-stack.*`。`zeka info <starter>` 返回属性类源码摘录、字段与来源。不要照抄未知配置项或把配置字段存在等同于已被运行时使用。

- 只有实际带 `@ConditionalOnMissingBean` 的 Bean 才能通过同类型 Bean 安全替换；其他情况先确认扩展点。
- 不通过 `@Bean return null` 禁用功能，不臆造属性开关，不重复注册统一异常处理器、过滤器或 MyBatis 拦截器。
- REST、Dict、MyBatis、Messaging、OpenAPI 的开关来自各属性类及条件；Kafka / RocketMQ 的 broker 配置遵循对应原生配置。
- 消息发送成功不代表消费成功；本地数据库事务不自动覆盖消息发送。重试、顺序、幂等和一致性由业务方案与所选中间件共同保证。
- 字典表为 `sys_dict_type`、`sys_dict_value`，端点为 `/dicts/options` 与 `/dicts/options/{typeCode}`；刷新、清空缓存的写端点需要应用层授权。

## 12. AI 交付自检

生成前列出拟使用的框架类型、依据和不确定点；生成后检查：

- 分层和命名与项目一致；没有 Controller 直连 DAO、万能 Service 或重复 Utils。
- 导入和方法真实存在；没有虚构 ResultCodeEnum、MessageSerializer、`MessagingTemplate.send(...)`。
- 依赖没有 Servlet / Reactive 冲突；POM 没把聚合模块当 JAR。
- Form 校验与校验组实际启用，更新路径 ID 一致，返回 DTO 排除敏感字段。
- PO 基类与真实列匹配，排序受控，参数绑定和事务边界明确。
- 统一异常/响应有接口验证，生成器占位内容已清理。
- 说明修改文件、测试证据和未验证事项；不得将示例或静态检查描述成生产可靠性保证。

## 13. 维护与来源

维护源为框架根目录 `arch.md`；CLI 和站点副本由 `supports/zeka-cli/scripts/generate.py` 生成，不手改副本。组件 Skill 随 starter JAR 发布；业务 Skill 可由 CLI 导出。

主要核对来源：`blen-kernel-generator` 的 Controller / Service / Entity / DTO / Form 模板，`blen-kernel-common` 的 base / api / assertion / mapstruct / util，`cubo-rest-servlet` 的 Advice 与 RestUtils，`cubo-mybatis-spring-boot-core` 的 base / service，以及各组件自动配置和示例。完整索引与来源哈希由生成脚本维护；索引覆盖不等同于逐行语义审计。
